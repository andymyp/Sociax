package utils

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error load environment")
	}
}

func GetEnvOrDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	return value
}

func GetEnvOrFail(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("Missing required environment: %s", key)
	}

	return value
}

func GetEnvIntOrFail(key string) int {
	val := GetEnvOrFail(key)
	num, err := strconv.Atoi(val)
	if err != nil {
		log.Fatalf("Invalid int value for env %s: %v", key, err)
	}
	return num
}
