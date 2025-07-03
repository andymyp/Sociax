package middlewares

import (
	"Sociax/shared-go/utils"
	"encoding/json"
	"log"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CorsMiddleware() fiber.Handler {
	allowedOrigins := getCorsOriginsFromEnv()

	return cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			return isOriginAllowed(origin, allowedOrigins)
		},
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
	})
}

func getCorsOriginsFromEnv() []string {
	raw := utils.GetEnvOrFail("CORS_ORIGINS")
	var origins []string
	if err := json.Unmarshal([]byte(raw), &origins); err != nil {
		log.Printf("Failed to parse CORS_ORIGINS: %v", err)
		return []string{}
	}
	return origins
}

func isOriginAllowed(origin string, allowed []string) bool {
	for _, o := range allowed {
		if o == "*" || o == origin {
			return true
		}

		if strings.HasPrefix(o, "https://*.") {
			base := strings.TrimPrefix(o, "https://*.")
			if strings.HasPrefix(origin, "https://") && strings.HasSuffix(origin, "."+base) {
				return true
			}
		}

		if strings.HasPrefix(o, "http://*.") {
			base := strings.TrimPrefix(o, "http://*.")
			if strings.HasPrefix(origin, "http://") && strings.HasSuffix(origin, "."+base) {
				return true
			}
		}
	}

	return false
}
