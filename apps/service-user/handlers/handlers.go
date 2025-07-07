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
	tracer  trace.Tracer
}

func NewHandlers(s services.Services, t trace.Tracer) *Handlers {
	return &Handlers{s, t}
}

func (h *Handlers) GetByID(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "UserByID")
	defer span.End()

	var req *models.IDRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	user, err := h.service.GetByID(req)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}

	return rabbitmq.SuccessResponse(user)
}

func (h *Handlers) GetByEmail(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "UserByEmail")
	defer span.End()

	var req *models.EmailRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	user, err := h.service.GetByEmail(req)

	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}

	return rabbitmq.SuccessResponse(user)
}

func (h *Handlers) GetByUsername(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "UserByUsername")
	defer span.End()

	var req *models.UsernameRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	user, err := h.service.GetByUsername(req)

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

	user, rpcErr, err := h.service.Update(req)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}

	if rpcErr != nil {
		return rabbitmq.ErrorResponse(rpcErr.Message, rpcErr.Code)
	}

	return rabbitmq.SuccessResponse(user)
}
