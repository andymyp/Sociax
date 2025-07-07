package handlers

import (
	"Sociax/service-gateway/helper"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func (h *Handlers) AuthHandler(action string) fiber.Handler {
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

		rpcBody, err := helper.MakeRpcRequestBody(body, c.AllParams(), c.Queries())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusInternalServerError,
					Message: err.Error(),
				},
			})
		}

		res, err := h.service.RpcService("auth", action, rpcBody)
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

		if dataMap, ok := res.Data.(map[string]interface{}); ok {
			if token, exists := dataMap["refresh_token"].(string); exists {
				c.Cookie(&fiber.Cookie{
					Name:     "refresh_token",
					Value:    token,
					HTTPOnly: true,
					Secure:   true,
					SameSite: "Lax",
					Path:     "/",
					MaxAge:   7 * 24 * 60 * 60,
				})
				delete(dataMap, "refresh_token")
			}
		}

		return c.JSON(res)
	}
}

func (h *Handlers) OAuthCallbackHandler(c *fiber.Ctx) error {
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

	rpcBody, err := helper.MakeRpcRequestBody(body, c.AllParams(), c.Queries())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(rabbitmq.RPCResponse{
			Error: &rabbitmq.RPCError{
				Code:    fiber.StatusInternalServerError,
				Message: err.Error(),
			},
		})
	}

	res, err := h.service.RpcService("auth", "sign-in-oauth-callback", rpcBody)
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

	var accessToken string

	if dataMap, ok := res.Data.(map[string]interface{}); ok {
		if token, exists := dataMap["refresh_token"].(string); exists {
			c.Cookie(&fiber.Cookie{
				Name:     "refresh_token",
				Value:    token,
				HTTPOnly: true,
				Secure:   true,
				SameSite: "Lax",
				Path:     "/",
				MaxAge:   7 * 24 * 60 * 60,
			})
			delete(dataMap, "refresh_token")
		}

		if token, exists := dataMap["access_token"].(string); exists {
			accessToken = token
		}
	}

	c.Response().Header.Del("Cross-Origin-Opener-Policy")
	c.Response().Header.Del("Cross-Origin-Embedder-Policy")
	c.Response().Header.Del("Cross-Origin-Resource-Policy")
	c.Response().Header.Del("Origin-Agent-Cluster")

	return c.Redirect(utils.GetEnvOrFail("FRONTEND_URL") + "/oauth/callback.html#access_token=" + accessToken)
}

func (h *Handlers) RefreshHandler(action string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		refreshToken := c.Cookies("refresh_token")
		if refreshToken == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(rabbitmq.RPCResponse{
				Error: &rabbitmq.RPCError{
					Code:    fiber.StatusUnauthorized,
					Message: "Unauthorized",
				},
			})
		}

		body := map[string]interface{}{
			"refresh_token": refreshToken,
		}

		data, _ := json.Marshal(body)
		res, err := h.service.RpcService("auth", action, data)
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

		return c.JSON(res)
	}
}

func (h *Handlers) SignOutHandler(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(rabbitmq.RPCResponse{
			Error: &rabbitmq.RPCError{
				Code:    fiber.StatusUnauthorized,
				Message: "Unauthorized",
			},
		})
	}

	body := map[string]interface{}{
		"refresh_token": refreshToken,
	}

	data, _ := json.Marshal(body)
	res, err := h.service.RpcService("auth", "sign-out", data)
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

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
		Path:     "/",
		MaxAge:   -1,
	})

	return c.JSON(res)
}
