package handlers

import (
	"Sociax/service-auth/services"
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

func (h *Handlers) SignUp(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "Sign Up")
	defer span.End()

	var user models.SignUpRequest

	if err := json.Unmarshal(body, &user); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(user); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	rpcErr, err := h.service.SignUp(user);
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}
	if rpcErr != nil {
		return rabbitmq.ErrorResponse(rpcErr.Message, rpcErr.Code)
	}
	
	return rabbitmq.SuccessResponse(map[string]interface{}{
		"email": user.Email,
	})
}
