package routes

import (
	"Sociax/service-user/handlers"
)

func Routes(handlers *handlers.Handlers) map[string]func([]byte) ([]byte, error) {
	return map[string]func([]byte) ([]byte, error){

		"create": handlers.Create,
		
	}
}