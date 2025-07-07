package config

import (
	"Sociax/shared-go/otelmetrics"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"

	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/storage/redis/v3"
)

var (
	ServiceName    string
	MetricsConfig  otelmetrics.Config
	RabbitMQConfig rabbitmq.Config
	LoggerConfig   logger.Config
)

func InitAllConfig() {
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
}

func InitFiberRedisStorage() *redis.Storage {
	return redis.New(redis.Config{
		Host:      utils.GetEnvOrFail("REDIS_HOST"),
		Port:      utils.GetEnvIntOrFail("REDIS_PORT"),
		Username:  utils.GetEnvOrFail("REDIS_USER"),
		Password:  utils.GetEnvOrFail("REDIS_PASS"),
		Database:  0,
		Reset:     false,
		TLSConfig: nil,
	})
}
