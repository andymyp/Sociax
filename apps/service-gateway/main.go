package main

import (
	"log"

	"Sociax/service-gateway/routes"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"

	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
  utils.LoadEnv()

	rpc, err := rabbitmq.NewClient(rabbitmq.Config{
		User:      utils.GetEnvOrFail("RABBITMQ_USER"),
		Password:  utils.GetEnvOrFail("RABBITMQ_PASS"),
		Host:      utils.GetEnvOrFail("RABBITMQ_HOST"),
		QueueName: utils.GetEnvOrFail("RABBITMQ_QUEUE"),
	})
	if err != nil {
		log.Fatal(err)
	}
	defer rpc.Close()

	app := fiber.New(fiber.Config{
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	app.Use(cors.New())
	app.Use(helmet.New())
	app.Use(limiter.New())

	app.Use(logger.New(logger.Config{
		Format:     "[${time}] ${status} - ${method} ${path}\n",
		TimeFormat: "2006/01/02 15:04:05",
		TimeZone:   "Asia/Jakarta",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Gateway service is running.")
	})

	routes.AuthRoutes(app, rpc)

	PORT := utils.GetEnvOrFail("PORT")
	if err:= app.Listen(":" + PORT); err != nil {
		log.Fatal(err.Error())
	}
}