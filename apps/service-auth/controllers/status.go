package controllers

import (
	"Sociax/shared-go/rabbitmq"
)

func Status(body []byte) ([]byte, error) {
	data := map[string]any{
		"message": "Auth service is running.",
	}

	return rabbitmq.SuccessResponse(data);
}