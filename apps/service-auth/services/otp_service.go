package services

import (
	"Sociax/service-auth/helper"
	"Sociax/service-auth/mailer"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"time"

	"github.com/google/uuid"
)

func (s *services) SendEmailOTP(req models.OTPRequest) (*rabbitmq.RPCError, error) {
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		err := &rabbitmq.RPCError{Message: "Email is not registered", Code: 404}
		return err, nil
	}

	lastOTP, err := s.repo.GetOTP(&models.OTPRequest{Email: req.Email, Type: req.Type})
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

	otp := helper.GenerateOTP()

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
	otp, err := s.repo.GetOTP(&models.OTPRequest{Email: req.Email, Type: req.Type})
	if err != nil {
		return nil, nil, err
	}
	if otp == nil {
		err := &rabbitmq.RPCError{Message: "Incorrect OTP", Code: 404}
		return nil, err, nil
	}

	if err := utils.HashCompare(otp.OTP, req.OTP); err != nil {
		err := &rabbitmq.RPCError{Message: "Incorrect OTP", Code: 400}
		return nil, err, nil
	}

	if time.Now().After(otp.ExpiresAt) {
		err := &rabbitmq.RPCError{Message: "OTP has expired", Code: 410}
		return nil, err, nil
	}

	otp.Used = true
	if err := s.repo.UpdateOTP(otp); err != nil {
		return nil, nil, err
	}

	if req.Type == 0 { // sign-up
		user, err := s.repo.GetUserByEmail(req.Email)
		if err != nil {
			return nil, nil, err
		}

		user.Confirmed = true
		if err := s.repo.UpdateUser(user); err != nil {
			return nil, nil, err
		}

		user.Password = nil
		user.Providers = nil
		accessToken, err := helper.GenerateAccessToken(user)
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
