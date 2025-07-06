package services

import (
	"Sociax/service-storage/types"
	"Sociax/shared-go/utils"
	"bytes"
	"context"
	"fmt"

	"github.com/minio/minio-go/v7"
)

type Services interface {
	Upload(req *types.UploadRequest) (string, error)
}

type services struct {
	client *minio.Client
}

func NewServices(client *minio.Client) Services {
	return &services{client}
}

func (s *services) Upload(req *types.UploadRequest) (string, error) {
	reader := bytes.NewReader(req.FileData)

	_, err := s.client.PutObject(context.Background(), req.Bucket, req.FileName, reader, int64(len(req.FileData)), minio.PutObjectOptions{
		ContentType: req.ContentType,
	})

	if err != nil {
		return "", err
	}

	url := fmt.Sprintf("%s/%s/%s", utils.GetEnvOrFail("MINIO_ENDPOINT"), req.Bucket, req.FileName)
	return url, nil
}
