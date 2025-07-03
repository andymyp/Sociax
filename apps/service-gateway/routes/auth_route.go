package routes

import (
	"Sociax/service-gateway/handlers"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App, handlers *handlers.Handlers) {
	api := app.Group("/api")
	route := api.Group("/auth")

	route.Post("/sign-up", handlers.DynamicHandler("auth", "sign-up"))
	route.Post("/send-email-otp", handlers.DynamicHandler("auth", "send-email-otp"))
	route.Post("/verify-otp", handlers.AuthHandler("verify-otp"))
	route.Post("/reset-password", handlers.AuthHandler("reset-password"))
	route.Post("/sign-in", handlers.AuthHandler("sign-in"))

	route.Get("/check-auth", handlers.RefreshHandler("check-auth"))
	route.Get("/refresh-token", handlers.RefreshHandler("refresh-token"))

	route.Get("/sign-out", handlers.SignOutHandler)
}
