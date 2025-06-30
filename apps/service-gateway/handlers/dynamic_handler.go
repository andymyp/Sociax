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
		var body map[string]interface{}

		if len(c.Body()) > 0 {
			if err := c.BodyParser(&body); err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(rabbitmq.RPCResponse{
					Error: &rabbitmq.RPCError{
						Code:    fiber.StatusBadRequest,
						Message: err.Error(),
					},
				})
			}
		}

		if body == nil {
			body = make(map[string]interface{})
		}

		for key, val := range c.AllParams() {
			body[key] = val
		}

		for key, val := range c.Queries() {
			body[key] = val
		}

		mergedData, err := json.Marshal(body)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		pub, err := h.rpc.Publish(context.Background(), service, action, mergedData)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		var res rabbitmq.RPCResponse

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
