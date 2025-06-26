package main

import (
	"Sociax/service-auth/routes"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"log"
)

func main() {
	utils.LoadEnv()

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

	err = rpc.Consume(routes.Routes())
	if err != nil {
		log.Fatal("failed to consume auth service: ", err)
	}

	log.Println("Auth service is running.")
	select {}
}