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
	_, span := h.tracer.Start(context.Background(), "CreateUser")
	defer span.End()

	var user models.User

	if err := json.Unmarshal(body, &user); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(user); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	rpcErr, err := h.service.Create(&user)

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

func (h *Handlers) FindByEmail(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "UserByEmail")
	defer span.End()

	var req models.EmailRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	user, err := h.service.FindByEmail(req.Email);
	
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}
	
	return rabbitmq.SuccessResponse(user)
}

func (h *Handlers) Update(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "UpdateUser")
	defer span.End()

	var req *models.User

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	user, err := h.service.Update(req)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}
	
	return rabbitmq.SuccessResponse(user)
}
