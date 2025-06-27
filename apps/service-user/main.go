package main

import (
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

	db := database.InitDatabase(
		utils.GetEnvOrFail("POSTGRES_HOST"),
		utils.GetEnvOrFail("POSTGRES_USER"),
		utils.GetEnvOrFail("POSTGRES_PASS"),
		utils.GetEnvOrFail("POSTGRES_DB"),
		utils.GetEnvOrFail("POSTGRES_PORT"),
	)
	
	cleanupTracer := oteltracer.InitTracer(
		utils.GetEnvOrFail("TRACER_ENDPOINT"),
		utils.GetEnvOrFail("SERVICE_NAME"),
	)
	defer cleanupTracer()

	tracer := otel.Tracer(utils.GetEnvOrFail("SERVICE_NAME"))

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