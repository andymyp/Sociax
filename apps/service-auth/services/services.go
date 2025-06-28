package services

import (
	// "Sociax/service-auth/mailer"
	"Sociax/service-auth/repository"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"
	"encoding/json"
	"time"
)

type Services interface {
	SignUp(user models.SignUpRequest) (*rabbitmq.RPCError, error)
}

type services struct {
	repo repository.Repository
	rpc *rabbitmq.RPCClient
}

func NewServices(r repository.Repository, rpc *rabbitmq.RPCClient) Services {
	return &services{r, rpc}
}

func (s *services) SignUp(user models.SignUpRequest) (*rabbitmq.RPCError, error) {
	var res *rabbitmq.RPCResponse
	
	user.Password = utils.Hashed(user.Password)
	body, _ := json.Marshal(user)
	pubCreate, err := s.rpc.Publish(context.Background(), "user", "create", body)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(pubCreate, &res); err != nil {
		return nil, err
	}
	if res.Error != nil {
		return res.Error, nil
	}

	otp := utils.GenerateOTP()

	emailOTP := models.EmailOTP{
		Email:     user.Email,
		OTP:       utils.Hashed(otp),
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}

	if err := s.repo.CreateOTP(&emailOTP); err != nil {
		return nil, err
	}

	// dataOTP := mailer.DataOTP{
	// 	Name: user.Name,
	// 	OTP: otp,
	// }

	// go mailer.SendEmailOTP(user.Email, dataOTP);

	return nil, nil
}
