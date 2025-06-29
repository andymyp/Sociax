package handlers

import (
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"
	"encoding/json"
)

func (h *Handlers) SignUp(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "SignUp")
	defer span.End()

	var user *models.User

	if err := json.Unmarshal(body, &user); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(user); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	rpcErr, err := h.service.SignUp(user)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}
	if rpcErr != nil {
		return rabbitmq.ErrorResponse(rpcErr.Message, rpcErr.Code)
	}

	return rabbitmq.SuccessResponse(map[string]interface{}{
		"type":  0,
		"email": user.Email,
	})
}

func (h *Handlers) ResetPassword(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "ResetPassword")
	defer span.End()

	var req *models.ResetPasswordRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	res, rpcErr, err := h.service.ResetPassword(req)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}
	if rpcErr != nil {
		return rabbitmq.ErrorResponse(rpcErr.Message, rpcErr.Code)
	}

	return rabbitmq.SuccessResponse(res)
}
