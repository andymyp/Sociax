package routes

import "Sociax/service-auth/controllers"

func Routes() map[string]func([]byte) ([]byte, error) {
	return map[string]func([]byte) ([]byte, error){
		"status":    controllers.Status,
	}
}