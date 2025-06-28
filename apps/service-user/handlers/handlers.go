package handlers

import (
	"Sociax/service-user/services"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"
	"encoding/json"

	"go.opentelemetry.io/otel/trace"
)

type Handlers struct {
	service services.Services
	tracer trace.Tracer
}

func NewHandlers(s services.Services, t trace.Tracer) *Handlers {
	return &Handlers{s, t}
}

func (h *Handlers) Create(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "Create User")
	defer span.End()

	var user models.User

	if err := json.Unmarshal(body, &user); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(user); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	status, err := h.service.Create(&user);
	
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}

	if status == 0 {
		return rabbitmq.ErrorResponse("Email is already registered", 409)
	}
	
	return rabbitmq.SuccessResponse(map[string]interface{}{
		"email": user.Email,
	})
}
