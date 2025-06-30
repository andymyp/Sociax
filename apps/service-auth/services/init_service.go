package services

import (
	"Sociax/service-auth/repository"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
)

type Services interface {
	SignUp(req *models.User) (*rabbitmq.RPCError, error)
	SendEmailOTP(req *models.OTPRequest) (*rabbitmq.RPCError, error)
	VerifyOTP(req *models.VerifyOTPRequest) (*models.AuthResponse, *rabbitmq.RPCError, error)
	ResetPassword(req *models.ResetPasswordRequest) (*models.AuthResponse, *rabbitmq.RPCError, error)
	SignIn(req *models.SignInRequest) (*models.AuthResponse, *rabbitmq.RPCError, error)
	SignInOAuth(req *models.OAuthRequest) string
	SignInGoogleCallback(req *models.OAuthCallbackRequest) (*models.AuthResponse, error)
	SignInGithubCallback(req *models.OAuthCallbackRequest) (*models.AuthResponse, error)
}

type services struct {
	repo repository.Repository
}

func NewServices(repo repository.Repository) Services {
	return &services{repo}
}
