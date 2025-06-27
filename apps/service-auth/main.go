package main

import (
	"Sociax/service-auth/handlers"
	"Sociax/service-auth/mailer"
	"Sociax/service-auth/repository"
	"Sociax/service-auth/routes"
	"Sociax/service-auth/services"
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

	mailer.InitMailer(
		utils.GetEnvOrFail("SMTP_HOST"),
		utils.GetEnvOrFail("SMTP_PORT"),
		utils.GetEnvOrFail("SMTP_USER"),
		utils.GetEnvOrFail("SMTP_PASS"),
		utils.GetEnvOrFail("SMTP_EMAIL"),
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
	service := services.NewServices(repo, rpc) 
	handler := handlers.NewHandlers(service, tracer)

	err = rpc.Consume(routes.Routes(handler))
	if err != nil {
		log.Fatal("failed to consume auth service: ", err)
	}

	log.Println("Auth service is running.")
	select {}
}