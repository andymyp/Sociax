package handlers

import (
	"Sociax/service-storage/services"
	"Sociax/service-storage/types"
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

func (h *Handlers) Upload(body []byte) ([]byte, error) {
	_, span := h.tracer.Start(context.Background(), "Upload")
	defer span.End()

	var req *types.UploadRequest

	if err := json.Unmarshal(body, &req); err != nil {
		return rabbitmq.ErrorResponse("Request is invalid", 400)
	}

	if err := utils.StructValidate(req); err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 400)
	}

	url, err := h.service.Upload(req)
	if err != nil {
		return rabbitmq.ErrorResponse(err.Error(), 500)
	}

	return rabbitmq.SuccessResponse(map[string]interface{}{
		"url": url,
	})
}
