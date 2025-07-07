package handlers

import (
	"Sociax/service-gateway/helper"
	"Sociax/shared-go/rabbitmq"

	"github.com/gofiber/fiber/v2"
)

func (h *Handlers) StorageHandler(action string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body map[string]interface{}

		fileHeader, err := c.FormFile("file")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		userID, ok := c.Locals("user_id").(string)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusUnauthorized,
					Message: "Unauthorized",
				},
			})
		}

		rpcBody, err := helper.MakeRpcRequestBodyWithFile(body, c.AllParams(), c.Queries(), fileHeader, userID)
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
