package controllers

import (
	"Sociax/shared-go/rabbitmq"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Status(rpc *rabbitmq.RPCClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		resp, err := rpc.Publish(ctx, "auth_queue", "status", c.Body())
		if err != nil {
			return c.Status(http.StatusBadGateway).JSON(fiber.Map{"error": err.Error()})
		}

		var result any
		if err := json.Unmarshal(resp, &result); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Invalid response from auth service"})
		}

		return c.JSON(result)
	}
}
