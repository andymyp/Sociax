package handlers

import (
	"Sociax/shared-go/rabbitmq"
	"context"
	"encoding/json"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type Handlers struct {
	rpc *rabbitmq.RPCClient
}

func NewHandlers(rpc *rabbitmq.RPCClient) *Handlers {
	return &Handlers{rpc}
}

func (h *Handlers) SignUp(c *fiber.Ctx) error {
	var res rabbitmq.RPCResponse

	pub, err := h.rpc.Publish(context.Background(), "auth", "sign-up", c.Body())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := json.Unmarshal(pub, &res); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(res)
}

func (h *Handlers) ForgotPassword(c *fiber.Ctx) error {
	var res rabbitmq.RPCResponse

	pub, err := h.rpc.Publish(context.Background(), "auth", "forgot-password", c.Body())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := json.Unmarshal(pub, &res); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(res)
}
