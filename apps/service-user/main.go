package main

import (
	"Sociax/service-user/config"
	"Sociax/service-user/handlers"
	"Sociax/service-user/repository"
	"Sociax/service-user/routes"
	"Sociax/service-user/services"
	"Sociax/shared-go/database"
	"Sociax/shared-go/oteltracer"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"log"

	"go.opentelemetry.io/otel"
)

func main() {
	utils.LoadEnv()
	config.InitAllConfig()

	db := database.InitDatabase(config.DatabaseConfig)

	cleanupTracer := oteltracer.InitTracer(config.TracerConfig)
	defer cleanupTracer()

	tracer := otel.Tracer(config.ServiceName)

	rpc, err := rabbitmq.NewClient(config.RabbitMQConfig)
	if err != nil {
		log.Fatal(err)
	}
	defer rpc.Close()

	repo := repository.NewRepository(db)
	service := services.NewServices(repo)
	handler := handlers.NewHandlers(service, tracer)

	err = rpc.Consume(routes.Routes(handler))
	if err != nil {
		log.Fatal("failed to consume user service: ", err)
	}

	log.Println("User service is running.")
	select {}
}
