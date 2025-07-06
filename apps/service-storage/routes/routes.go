package routes

import (
	"Sociax/service-storage/handlers"
)

func Routes(handlers *handlers.Handlers) map[string]func([]byte) ([]byte, error) {
	return map[string]func([]byte) ([]byte, error){

		"upload": handlers.Upload,
	}
}
