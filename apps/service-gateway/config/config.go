package config

import (
	"Sociax/shared-go/otelmetrics"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"sync"

	"github.com/gofiber/fiber/v2/middleware/logger"
)

var (
	once           sync.Once
	ServiceName    string
	MetricsConfig  otelmetrics.Config
	RabbitMQConfig rabbitmq.Config
	LoggerConfig   logger.Config
)

func InitAllConfig() {
	once.Do(func() {
		ServiceName = utils.GetEnvOrFail("SERVICE_NAME")

		MetricsConfig = otelmetrics.Config{
			Endpoint: utils.GetEnvOrFail("METRICS_ENDPOINT"),
			Service:  utils.GetEnvOrFail("SERVICE_NAME"),
		}

		RabbitMQConfig = rabbitmq.Config{
			User:      utils.GetEnvOrFail("RABBITMQ_USER"),
			Password:  utils.GetEnvOrFail("RABBITMQ_PASS"),
			Host:      utils.GetEnvOrFail("RABBITMQ_HOST"),
			QueueName: utils.GetEnvOrFail("RABBITMQ_QUEUE"),
		}

		LoggerConfig = logger.Config{
			Format:     "[${time}] ${status} - ${method} ${path} ${latency}\n",
			TimeFormat: "2006/01/02 15:04:05",
			TimeZone:   "Asia/Jakarta",
		}
	})
}
