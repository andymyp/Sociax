package handlers

import (
	"Sociax/shared-go/rabbitmq"
)

type Handlers struct {
	rpc *rabbitmq.RPCClient
}

func NewHandlers(rpc *rabbitmq.RPCClient) *Handlers {
	return &Handlers{rpc}
}
