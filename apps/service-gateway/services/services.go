package services

import (
	"Sociax/shared-go/rabbitmq"
	"context"
	"encoding/json"
)

type Services interface {
	RpcService(service, action string, body []byte) (*rabbitmq.RPCResponse, error)
}

type services struct {
	rpc *rabbitmq.RPCClient
}

func NewServices(rpc *rabbitmq.RPCClient) Services {
	return &services{rpc}
}

func (s *services) RpcService(service, action string, body []byte) (*rabbitmq.RPCResponse, error) {
	pub, err := s.rpc.Publish(context.Background(), service, action, body)
	if err != nil {
		return nil, err
	}

	var res *rabbitmq.RPCResponse
	if err := json.Unmarshal(pub, &res); err != nil {
		return nil, err
	}

	return res, nil
}
