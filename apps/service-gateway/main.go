package main

import (
	"log"

	"Sociax/service-gateway/config"
	"Sociax/service-gateway/handlers"
	"Sociax/service-gateway/routes"
	"Sociax/shared-go/otelmetrics"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"

	"github.com/goccy/go-json"
	"github.com/gofiber/contrib/otelfiber/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	utils.LoadEnv()
	config.InitAllConfig()

	cleanupMatrics := otelmetrics.InitMetrics(config.MetricsConfig)
	defer cleanupMatrics()

	rpc, err := rabbitmq.NewClient(config.RabbitMQConfig)
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
	app.Use(logger.New(config.LoggerConfig))

	app.Use(otelfiber.Middleware())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Gateway service is running.")
	})

	handler := handlers.NewHandlers(rpc)

	routes.AuthRoutes(app, handler)

	PORT := utils.GetEnvOrFail("PORT")
	if err := app.Listen(":" + PORT); err != nil {
		log.Fatal(err.Error())
	}
}
