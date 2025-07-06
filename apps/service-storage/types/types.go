package types

type UploadRequest struct {
	Bucket      string `json:"email" validate:"required"`
	ContentType string `json:"content_type" validate:"required"`
	FileName    string `json:"file_name" validate:"required"`
	FileData    []byte `json:"file_data" validate:"required"`
}
