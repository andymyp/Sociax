package helper

import "encoding/json"

func MakeRpcRequestBody(body map[string]interface{}, params, queries map[string]string) ([]byte, error) {
	if body == nil {
		body = make(map[string]interface{})
	}

	for key, val := range params {
		body[key] = val
	}

	for key, val := range queries {
		body[key] = val
	}

	mergedData, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	return mergedData, nil
}
