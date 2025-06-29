package services

import (
	"Sociax/service-auth/helper"
	"Sociax/service-auth/mailer"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"time"
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
