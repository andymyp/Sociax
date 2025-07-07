package redis

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

func InitRedisClient(cfg *redis.Options) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Addr,
		Username: cfg.Username,
		Password: cfg.Password,
		DB:       0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatal("Failed connect to Redis:", err)
	}

	return rdb
}
