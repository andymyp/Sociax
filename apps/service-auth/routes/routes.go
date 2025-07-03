package routes

import (
	"Sociax/service-auth/handlers"
)

func Routes(handlers *handlers.Handlers) map[string]func([]byte) ([]byte, error) {
	return map[string]func([]byte) ([]byte, error){

		"sign-up":                handlers.SignUp,
		"send-email-otp":         handlers.SendEmailOTP,
		"verify-otp":             handlers.VerifyOTP,
		"reset-password":         handlers.ResetPassword,
		"sign-in":                handlers.SignIn,
		"sign-in-oauth":          handlers.SignInOAuth,
		"sign-in-oauth-callback": handlers.SignInOAuthCallback,
		"refresh-token":          handlers.RefreshToken,
		"check-auth":             handlers.CheckAuth,
		"sign-out":               handlers.SignOut,
	}
}
