package handlers

import (
	"Sociax/service-auth/services"

	"go.opentelemetry.io/otel/trace"
)

type Handlers struct {
	service services.Services
	tracer  trace.Tracer
}

func NewHandlers(s services.Services, t trace.Tracer) *Handlers {
	return &Handlers{s, t}
}
