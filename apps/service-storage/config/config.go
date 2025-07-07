package config

import (
	"Sociax/shared-go/oteltracer"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var (
	ServiceName    string
	JwtSecret      []byte
	TracerConfig   oteltracer.Config
	RabbitMQConfig rabbitmq.Config
)

func InitAllConfig() {
	ServiceName = utils.GetEnvOrFail("SERVICE_NAME")
	JwtSecret = []byte(utils.GetEnvOrFail("JWT_SECRET"))

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

func NewMinIOClient() *minio.Client {
	endpoint := utils.GetEnvOrFail("MINIO_ENDPOINT")
	user := utils.GetEnvOrFail("MINIO_USER")
	pass := utils.GetEnvOrFail("MINIO_PASS")

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(user, pass, ""),
		Secure: false,
	})

	if err != nil {
		log.Fatalf("Failed to connect to MinIO: %v", err)
	}

	log.Println("Connected to MinIO")
	return client
}
