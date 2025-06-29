package handlers

import (
	"Sociax/shared-go/rabbitmq"
	"context"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

type Handlers struct {
	rpc *rabbitmq.RPCClient
}

func NewHandlers(rpc *rabbitmq.RPCClient) *Handlers {
	return &Handlers{rpc}
}

func (h *Handlers) DynamicHandler(service, action string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var res rabbitmq.RPCResponse

		pub, err := h.rpc.Publish(context.Background(), service, action, c.Body())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		if err := json.Unmarshal(pub, &res); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		if res.Error != nil {
			return c.Status(res.Error.Code).JSON(res)
		}

		return c.JSON(res)
	}
}
