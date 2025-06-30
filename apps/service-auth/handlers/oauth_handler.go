package handlers

import (
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"context"
	"encoding/json"
	"net/url"
)

func (h *Handlers) SignInOAuth(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "SignInOAuth")
	defer span.End()

	var req *models.OAuthRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	res := h.service.SignInOAuth(req)

	return rabbitmq.SuccessResponse(map[string]interface{}{
		"url": res,
	})
}

func (h *Handlers) SignInOAuthCallback(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "SignInOAuthCallback")
	defer span.End()

	var req *models.OAuthCallbackRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	stateDecoded, err := url.QueryUnescape(req.State)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}

	values, err := url.ParseQuery(stateDecoded)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}

	req.DeviceID = values.Get("device_id")
	req.Device = values.Get("device")

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	var authRes *models.AuthResponse

	if req.Provider == "google" {
		res, err := h.service.SignInGoogleCallback(req)
		if err != nil {
			return rabbitmq.ErrorResponse(err.Error(), 500)
		}

		authRes = res
	}

	if req.Provider == "github" {
		res, err := h.service.SignInGithubCallback(req)
		if err != nil {
			return rabbitmq.ErrorResponse(err.Error(), 500)
		}

		authRes = res
	}

	return rabbitmq.SuccessResponse(authRes)
}
