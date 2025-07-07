package handlers

import (
	"Sociax/service-gateway/services"
)

type Handlers struct {
	service services.Services
}

func NewHandlers(service services.Services) *Handlers {
	return &Handlers{service}
}
