package middlewares

import (
	"Sociax/shared-go/rabbitmq"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/storage/redis/v3"
)

func Limiter(redisStorage *redis.Storage) fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
		Storage:    redisStorage,

		KeyGenerator: func(c *fiber.Ctx) string {
			if userID, ok := c.Locals("user_id").(string); ok {
				return "user: " + userID
			}

			return "ip: " + c.IP()
		},

		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(rabbitmq.RPCError{
				Code:    fiber.StatusTooManyRequests,
				Message: "Too many requests. Please try again later",
			})
		},
	})
}
