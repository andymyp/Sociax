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

func (s *services) SignUp(req *models.User) (*rabbitmq.RPCError, error) {
	checkUser, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return nil, err
	}

	if checkUser != nil && checkUser.Confirmed {
		err := &rabbitmq.RPCError{Message: "Email is already registered", Code: 409}
		return err, nil
	}

	if req.Password != nil {
		hashedPass := utils.Hashed(*req.Password)
		req.Password = &hashedPass
	}

	if checkUser != nil && !checkUser.Confirmed {
		req.ID = checkUser.ID
		req.CreatedAt = checkUser.CreatedAt

		if err := s.repo.UpdateUser(req); err != nil {
			return nil, err
		}
	}

	if checkUser == nil {
		user, err := s.repo.CreateUser(req)
		if err != nil {
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
	}

	otp := helper.GenerateOTP()

	emailOTP := models.EmailOTP{
		Email:     req.Email,
		Type:      0,
		OTP:       utils.Hashed(otp),
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}

	if err := s.repo.CreateOTP(&emailOTP); err != nil {
		return nil, err
	}

	dataOTP := mailer.DataOTP{
		Name: req.Name,
		OTP:  otp,
	}

	go mailer.SendEmailOTP(req.Email, dataOTP)

	return nil, nil
}

func (s *services) ResetPassword(req *models.ResetPasswordRequest) (*models.AuthResponse, *rabbitmq.RPCError, error) {
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return nil, nil, err
	}
	if user == nil {
		err := &rabbitmq.RPCError{Message: "Email is not registered", Code: 404}
		return nil, err, nil
	}

	hashedPass := utils.Hashed(req.Password)
	user.Password = &hashedPass

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
		DeviceID:  req.DeviceID,
		Device:    req.Device,
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

func (s *services) SignIn(req *models.SignInRequest) (*models.AuthResponse, *rabbitmq.RPCError, error) {
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return nil, nil, err
	}
	if user == nil {
		err := &rabbitmq.RPCError{Message: "Invalid email or password", Code: 401}
		return nil, err, nil
	}
	if !user.Confirmed || user.Password == nil {
		err := &rabbitmq.RPCError{Message: "Invalid email or password", Code: 401}
		return nil, err, nil
	}
	if err := utils.HashCompare(*user.Password, req.Password); err != nil {
		err := &rabbitmq.RPCError{Message: "Invalid email or password", Code: 401}
		return nil, err, nil
	}

	user.Password = nil
	user.Providers = nil
	accessToken, err := helper.GenerateAccessToken(user)
	if err != nil {
		return nil, nil, err
	}

	refreshToken := utils.Hashed(uuid.NewString())

	rt := &models.RefreshToken{
		DeviceID:  req.DeviceID,
		Device:    req.Device,
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

func (s *services) RefreshToken(req *models.RefreshTokenRequest) (*models.AuthResponse, *rabbitmq.RPCError, error) {
	refreshToken, err := s.repo.GetRefreshToken(req)
	if err != nil {
		return nil, nil, err
	}
	if refreshToken == nil {
		err := &rabbitmq.RPCError{Message: "Unauthorized", Code: 401}
		return nil, err, nil
	}

	if time.Now().After(refreshToken.ExpiresAt) {
		err := &rabbitmq.RPCError{Message: "Unauthorized", Code: 410}
		return nil, err, nil
	}

	user, err := s.repo.GetUserByID(refreshToken.UserID)
	if err != nil {
		return nil, nil, err
	}

	user.Password = nil
	user.Providers = nil
	accessToken, err := helper.GenerateAccessToken(user)
	if err != nil {
		return nil, nil, err
	}

	authResponse := &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken.Token,
	}

	return authResponse, nil, nil
}

func (s *services) RevokeRefreshToken(req *models.RefreshTokenRequest) (*rabbitmq.RPCError, error) {
	refreshToken, err := s.repo.GetRefreshToken(req)
	if err != nil {
		return nil, err
	}
	if refreshToken == nil {
		err := &rabbitmq.RPCError{Message: "Unauthorized", Code: 401}
		return err, nil
	}

	refreshToken.Revoked = true
	if err := s.repo.UpdateRefreshToken(refreshToken); err != nil {
		return nil, err
	}

	return nil, nil
}
