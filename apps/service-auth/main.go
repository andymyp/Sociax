package main

import (
	"Sociax/service-auth/controllers"
	"Sociax/service-auth/routes"
	"Sociax/shared-go/oteltracer"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"log"
)

func main() {
	utils.LoadEnv()
	
	cleanupTracer := oteltracer.InitTracer(
		utils.GetEnvOrFail("TRACER_ENDPOINT"),
		utils.GetEnvOrFail("SERVICE_NAME"),
	)
	defer cleanupTracer()

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

	controllers.InitTracer()

	err = rpc.Consume(routes.Routes())
	if err != nil {
		log.Fatal("failed to consume auth service: ", err)
	}

	log.Println("Auth service is running.")
	select {}
}