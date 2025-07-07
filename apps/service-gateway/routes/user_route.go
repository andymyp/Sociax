package routes

import (
	"Sociax/service-gateway/handlers"
	"Sociax/service-gateway/middlewares"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app *fiber.App, handlers *handlers.Handlers) {
	api := app.Group("/api")
	route := api.Group("/user", middlewares.Access())

	route.Get("/:username", handlers.DynamicHandler("user", "get-by-username"))
	route.Patch("/:id", handlers.DynamicHandler("user", "update"))
}
