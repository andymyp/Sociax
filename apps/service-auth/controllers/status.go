package controllers

import (
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
)

var tracer trace.Tracer

func InitTracer() {
	tracer = otel.Tracer(utils.GetEnvOrFail("SERVICE_NAME"))
}

func Status(body []byte) ([]byte, error) {
	_, span := tracer.Start(context.Background(), "Status")
	defer span.End()
	
	data := map[string]any{
		"message": "Auth service is running.",
	}

	return rabbitmq.SuccessResponse(data);
}