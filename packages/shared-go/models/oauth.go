package models

type OAuthRequest struct {
	DeviceID string `json:"device_id" validate:"required"`
	Device   string `json:"device" validate:"required,oneof=web android ios"`
	Provider string `json:"provider" validate:"required"`
}

type OAuthCallbackRequest struct {
	State    string `json:"state" validate:"required"`
	DeviceID string `json:"device_id" validate:"required"`
	Device   string `json:"device" validate:"required,oneof=web android ios"`
	Provider string `json:"provider" validate:"required"`
	Code     string `json:"code" validate:"required"`
}

type OAuthGoogleResponse struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Picture string `json:"picture"`
}

type OAuthGithubResponse struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarUrl string `json:"avatar_url"`
}
