package routes

import (
	"Sociax/service-gateway/handlers"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App, handlers *handlers.Handlers) {
	api := app.Group("/api")
	route := api.Group("/auth")

	route.Post("/sign-up", handlers.DynamicHandler("auth", "sign-up"))
	route.Post("/forgot-password", handlers.DynamicHandler("auth", "forgot-password"))
}