package rabbitmq

import (
	"encoding/json"
)

type RPCResponse struct {
	Code int `json:"code,omitempty"`
	Data  interface{} `json:"data,omitempty"`
	Error *RPCError   `json:"error,omitempty"`
}

type RPCError struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func SuccessResponse(data interface{}) ([]byte, error) {
	return json.Marshal(RPCResponse{
		Code: 200,
		Data: data,
	})
}

func ErrorResponse(message string, code int) ([]byte, error) {
	return json.Marshal(RPCResponse{
		Error: &RPCError{
			Message: message,
			Code:    code,
		},
	})
}