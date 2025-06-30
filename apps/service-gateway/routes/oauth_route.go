package routes

import (
	"Sociax/service-gateway/handlers"

	"github.com/gofiber/fiber/v2"
)

func OAuthRoutes(app *fiber.App, handlers *handlers.Handlers) {
	api := app.Group("/api")
	route := api.Group("/oauth")

	route.Get("/sign-in", handlers.DynamicHandler("auth", "sign-in-oauth"))
	route.Get("/:provider/callback", handlers.DynamicHandler("auth", "sign-in-oauth-callback"))
}
