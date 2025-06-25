package main

import (
	"log"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	app.Use(cors.New())
	app.Use(helmet.New())
	app.Use(limiter.New())
	app.Use(logger.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Gateway service is running.")
	})

	log.Fatal(app.Listen(":3001"))
}