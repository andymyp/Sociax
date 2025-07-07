package config

import (
	"Sociax/shared-go/database"
	"Sociax/shared-go/oteltracer"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
)

var (
	ServiceName    string
	DatabaseConfig database.Config
	TracerConfig   oteltracer.Config
	RabbitMQConfig rabbitmq.Config
)

func InitAllConfig() {
	ServiceName = utils.GetEnvOrFail("SERVICE_NAME")

	DatabaseConfig = database.Config{
		Host: utils.GetEnvOrFail("POSTGRES_HOST"),
		User: utils.GetEnvOrFail("POSTGRES_USER"),
		Pass: utils.GetEnvOrFail("POSTGRES_PASS"),
		DB:   utils.GetEnvOrFail("POSTGRES_DB"),
		Port: utils.GetEnvOrFail("POSTGRES_PORT"),
	}

	TracerConfig = oteltracer.Config{
		Endpoint: utils.GetEnvOrFail("TRACER_ENDPOINT"),
		Service:  utils.GetEnvOrFail("SERVICE_NAME"),
	}

	RabbitMQConfig = rabbitmq.Config{
		User:      utils.GetEnvOrFail("RABBITMQ_USER"),
		Password:  utils.GetEnvOrFail("RABBITMQ_PASS"),
		Host:      utils.GetEnvOrFail("RABBITMQ_HOST"),
		QueueName: utils.GetEnvOrFail("RABBITMQ_QUEUE"),
	}
}
