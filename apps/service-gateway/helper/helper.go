package helper

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"path/filepath"
	"time"
)

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

func MakeRpcRequestBodyWithFile(
	body map[string]interface{},
	params, queries map[string]string,
	file *multipart.FileHeader,
	userID string,
) ([]byte, error) {
	if body == nil {
		body = make(map[string]interface{})
	}

	for key, val := range params {
		body[key] = val
	}

	for key, val := range queries {
		body[key] = val
	}

	fileOpen, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer fileOpen.Close()

	var buf bytes.Buffer
	_, err = io.Copy(&buf, fileOpen)
	if err != nil {
		return nil, err
	}

	filename := file.Filename

	if bucket, ok := body["bucket"].(string); ok {
		switch bucket {
		case "avatars":
			ext := filepath.Ext(file.Filename)
			filename = fmt.Sprintf("%s%s", userID, ext)
		default:
			filename = fmt.Sprintf("%d_%s", time.Now().Unix(), filename)
		}
	}

	body["content_type"] = file.Header.Get("Content-Type")
	body["file_name"] = filename
	body["file_data"] = buf.Bytes()

	mergedData, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	return mergedData, nil
}
