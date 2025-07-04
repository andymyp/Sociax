package handlers

import (
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"
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

		pub, err := h.rpc.Publish(context.Background(), "auth", action, mergedData)
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

		if dataMap, ok := res.Data.(map[string]interface{}); ok {
			if token, exists := dataMap["refresh_token"].(string); exists {
				c.Cookie(&fiber.Cookie{
					Name:     "refresh_token",
					Value:    token,
					HTTPOnly: true,
					Secure:   false,
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

	pub, err := h.rpc.Publish(context.Background(), "auth", "sign-in-oauth-callback", mergedData)
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

	if dataMap, ok := res.Data.(map[string]interface{}); ok {
		if token, exists := dataMap["refresh_token"].(string); exists {
			c.Cookie(&fiber.Cookie{
				Name:     "refresh_token",
				Value:    token,
				HTTPOnly: true,
				Secure:   false,
				SameSite: "Lax",
				Path:     "/",
				MaxAge:   7 * 24 * 60 * 60,
			})
			delete(dataMap, "refresh_token")
		}
	}

	var accessToken string

	if dataMap, ok := res.Data.(map[string]interface{}); ok {
		if token, exists := dataMap["refresh_token"].(string); exists {
			c.Cookie(&fiber.Cookie{
				Name:     "refresh_token",
				Value:    token,
				HTTPOnly: true,
				Secure:   false,
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
		pub, err := h.rpc.Publish(context.Background(), "auth", action, data)
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
	pub, err := h.rpc.Publish(context.Background(), "auth", "sign-out", data)
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

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    "",
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
		Path:     "/",
		MaxAge:   -1,
	})

	return c.JSON(res)
}
