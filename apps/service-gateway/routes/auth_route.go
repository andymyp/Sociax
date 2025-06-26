package routes

import (
	"Sociax/service-gateway/controllers"
	"Sociax/shared-go/rabbitmq"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app *fiber.App, rpc *rabbitmq.RPCClient) {
	api := app.Group("/api")

	user := api.Group("/auth")
	user.Get("/status", controllers.Status(rpc))
}