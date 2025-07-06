package handlers

import (
	"Sociax/service-gateway/helper"
	"Sociax/shared-go/rabbitmq"

	"github.com/gofiber/fiber/v2"
)

func (h *Handlers) StorageHandler(action string) fiber.Handler {
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

		fileHeader, err := c.FormFile("file")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		rpcBody, err := helper.MakeRpcRequestBodyWithFile(body, c.AllParams(), c.Queries(), fileHeader)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		res, err := h.service.RpcService("storage", action, rpcBody)
		if err != nil {
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

		return c.Status(res.Code).JSON(res)
	}
}
