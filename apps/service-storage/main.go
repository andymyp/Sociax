package main

import (
	"Sociax/service-storage/config"
	"Sociax/service-storage/handlers"
	"Sociax/service-storage/routes"
	"Sociax/service-storage/services"
	"Sociax/shared-go/oteltracer"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"log"

	"go.opentelemetry.io/otel"
)

func main() {
	utils.LoadEnv()
	config.InitAllConfig()

	cleanupTracer := oteltracer.InitTracer(config.TracerConfig)
	defer cleanupTracer()

	tracer := otel.Tracer(config.ServiceName)

	client := config.NewMinIOClient()

	rpc, err := rabbitmq.NewClient(config.RabbitMQConfig)
	if err != nil {
		log.Fatal(err)
	}
	defer rpc.Close()

	service := services.NewServices(client)
	handler := handlers.NewHandlers(service, tracer)

	err = rpc.Consume(routes.Routes(handler))
	if err != nil {
		log.Fatal("failed to consume storage service: ", err)
	}

	log.Println("Storage service is running.")
	select {}
}
