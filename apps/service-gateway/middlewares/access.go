package middlewares

import (
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func Access() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(rabbitmq.RPCError{
				Code:    fiber.StatusUnauthorized,
				Message: "Unauthorized",
			})
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}

			return []byte(utils.GetEnvOrFail("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(rabbitmq.RPCError{
				Code:    fiber.StatusUnauthorized,
				Message: "Unauthorized",
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(rabbitmq.RPCError{
				Code:    fiber.StatusUnauthorized,
				Message: "Invalid token claims",
			})
		}

		userID, ok := claims["id"].(string)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(rabbitmq.RPCError{
				Code:    fiber.StatusUnauthorized,
				Message: "Missing id in token",
			})
		}

		c.Locals("user_id", userID)
		return c.Next()
	}
}
