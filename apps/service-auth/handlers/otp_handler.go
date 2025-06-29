package handlers

import (
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"
	"encoding/json"
)

func (h *Handlers) SendEmailOTP(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "SendEmailOTP")
	defer span.End()

	var req *models.OTPRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	rpcErr, err := h.service.SendEmailOTP(req)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}
	if rpcErr != nil {
		return rabbitmq.ErrorResponse(rpcErr.Message, rpcErr.Code)
	}

	return rabbitmq.SuccessResponse(map[string]interface{}{
		"type":  req.Type,
		"email": req.Email,
	})
}

func (h *Handlers) VerifyOTP(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "VerifyOTP")
	defer span.End()

	var req *models.VerifyOTPRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	res, rpcErr, err := h.service.VerifyOTP(req)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}
	if rpcErr != nil {
		return rabbitmq.ErrorResponse(rpcErr.Message, rpcErr.Code)
	}
	if res != nil {
		return rabbitmq.SuccessResponse(res)
	}

	return rabbitmq.SuccessResponse(map[string]interface{}{
		"type":  req.Type,
		"email": req.Email,
	})
}
