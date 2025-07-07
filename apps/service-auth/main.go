package main

import (
	"Sociax/service-auth/config"
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
	config.InitAllConfig()

	db := database.InitDatabase(config.DatabaseConfig)

	mailer.InitMailer(config.MailerConfig)

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
		log.Fatal("failed to consume auth service: ", err)
	}

	log.Println("Auth service is running.")
	select {}
}
