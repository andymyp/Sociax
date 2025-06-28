package routes

import (
	"Sociax/service-auth/handlers"
)

func Routes(handlers *handlers.Handlers) map[string]func([]byte) ([]byte, error) {
	return map[string]func([]byte) ([]byte, error){

		"sign-up": handlers.SignUp,
		"send-email-otp": handlers.SendEmailOTP,
		
	}
}