package services

import (
	"Sociax/service-auth/mailer"
	"Sociax/service-auth/repository"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Services interface {
	SignUp(user models.User) (*rabbitmq.RPCError, error)
	SendEmailOTP(req models.OTPRequest) (*rabbitmq.RPCError, error)
	VerifyOTP(req models.VerifyOTPRequest) (*models.AuthResponse, *rabbitmq.RPCError, error)
}

type services struct {
	repo repository.Repository
	rpc  *rabbitmq.RPCClient
}

func NewServices(r repository.Repository, rpc *rabbitmq.RPCClient) Services {
	return &services{r, rpc}
}

func (s *services) SignUp(req models.User) (*rabbitmq.RPCError, error) {
	var res *rabbitmq.RPCResponse

	if req.Password != nil {
		hashedPass := utils.Hashed(*req.Password)
		req.Password = &hashedPass
	}

	body, _ := json.Marshal(req)
	pub, err := s.rpc.Publish(context.Background(), "user", "create", body)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(pub, &res); err != nil {
		return nil, err
	}
	if res.Error != nil {
		return res.Error, nil
	}

	var user models.User
	dataBytes, err := json.Marshal(res.Data)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(dataBytes, &user); err != nil {
		return nil, err
	}

	provider := &models.AuthProvider{
		UserID:     user.ID,
		Provider:   "email",
		ProviderID: user.Email,
	}

	if err := s.repo.CreateAuthProvider(provider); err != nil {
		return nil, err
	}

	otp := utils.GenerateOTP()

	emailOTP := models.EmailOTP{
		Email:     user.Email,
		Type:      0,
		OTP:       utils.Hashed(otp),
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}

	if err := s.repo.CreateOTP(&emailOTP); err != nil {
		return nil, err
	}

	dataOTP := mailer.DataOTP{
		Name: user.Name,
		OTP:  otp,
	}

	go mailer.SendEmailOTP(user.Email, dataOTP)

	return nil, nil
}

func (s *services) SendEmailOTP(req models.OTPRequest) (*rabbitmq.RPCError, error) {
	var res *rabbitmq.RPCResponse

	body, _ := json.Marshal(&models.EmailRequest{Email: req.Email})
	pub, err := s.rpc.Publish(context.Background(), "user", "find-by-email", body)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(pub, &res); err != nil {
		return nil, err
	}
	if res.Error != nil {
		return res.Error, nil
	}
	if res.Data == nil {
		err := &rabbitmq.RPCError{Message: "Email is not registered", Code: 404}
		return err, nil
	}

	var user models.User
	dataBytes, err := json.Marshal(res.Data)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(dataBytes, &user); err != nil {
		return nil, err
	}

	lastOTP, err := s.repo.FindOTP(models.OTPRequest{Email: req.Email, Type: req.Type})
	if err != nil {
		return nil, err
	}
	if lastOTP != nil {
		cooldown := 1 * time.Minute
		elapsed := time.Since(lastOTP.CreatedAt)

		if elapsed < cooldown {
			waitTime := cooldown - elapsed
			err := &rabbitmq.RPCError{
				Message: "Please wait " + waitTime.Round(time.Second).String() + " before request OTP again",
				Code:    429,
			}
			return err, nil
		}
	}

	otp := utils.GenerateOTP()

	emailOTP := models.EmailOTP{
		Email:     user.Email,
		Type:      req.Type,
		OTP:       utils.Hashed(otp),
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}

	if err := s.repo.CreateOTP(&emailOTP); err != nil {
		return nil, err
	}

	dataOTP := mailer.DataOTP{
		Name: user.Name,
		OTP:  otp,
	}

	go mailer.SendEmailOTP(user.Email, dataOTP)

	return nil, nil
}

func (s *services) VerifyOTP(req models.VerifyOTPRequest) (*models.AuthResponse, *rabbitmq.RPCError, error) {
	record, err := s.repo.FindOTP(models.OTPRequest{Email: req.Email, Type: req.Type})
	if err != nil {
		return nil, nil, err
	}
	if record == nil {
		err := &rabbitmq.RPCError{Message: "OTP not found", Code: 404}
		return nil, err, nil
	}

	if err := utils.HashCompare(record.OTP, req.OTP); err != nil {
		err := &rabbitmq.RPCError{Message: "Incorrect OTP", Code: 400}
		return nil, err, nil
	}

	if time.Now().After(record.ExpiresAt) {
		err := &rabbitmq.RPCError{Message: "OTP has expired", Code: 410}
		return nil, err, nil
	}

	record.Used = true
	if err := s.repo.UpdateOTP(record); err != nil {
		return nil, nil, err
	}

	if req.Type == 0 { // sign-up
		var res *rabbitmq.RPCResponse
		body, _ := json.Marshal(&models.EmailRequest{Email: req.Email})
		pub, err := s.rpc.Publish(context.Background(), "user", "find-by-email", body)
		if err != nil {
			return nil, nil, err
		}
		if err := json.Unmarshal(pub, &res); err != nil {
			return nil, nil, err
		}
		if res.Error != nil {
			return nil, res.Error, nil
		}

		var user models.User
		dataBytes, err := json.Marshal(res.Data)
		if err != nil {
			return nil, nil, err
		}
		if err := json.Unmarshal(dataBytes, &user); err != nil {
			return nil, nil, err
		}

		user.Confirmed = true

		body, _ = json.Marshal(user)
		pub, err = s.rpc.Publish(context.Background(), "user", "update", body)
		if err != nil {
			return nil, nil, err
		}
		if err := json.Unmarshal(pub, &res); err != nil {
			return nil, nil, err
		}
		if res.Error != nil {
			return nil, res.Error, nil
		}

		user.Password = nil
		user.Providers = nil
		accessToken, err := GenerateAccessToken(user)
		if err != nil {
			return nil, nil, err
		}

		refreshToken := utils.Hashed(uuid.NewString())

		rt := &models.RefreshToken{
			UserID:    user.ID,
			Token:     refreshToken,
			ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
		}

		if err := s.repo.CreateRefreshToken(rt); err != nil {
			return nil, nil, err
		}

		authResponse := &models.AuthResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		}

		return authResponse, nil, nil
	}

	return nil, nil, nil
}
