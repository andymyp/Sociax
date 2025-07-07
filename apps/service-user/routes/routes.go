package routes

import (
	"Sociax/service-user/handlers"
)

func Routes(handlers *handlers.Handlers) map[string]func([]byte) ([]byte, error) {
	return map[string]func([]byte) ([]byte, error){

		"get-by-id":       handlers.GetByID,
		"get-by-email":    handlers.GetByEmail,
		"get-by-username": handlers.GetByUsername,
		"update":          handlers.Update,
	}
}
