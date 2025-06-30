package models

type OAuthRequest struct {
	Provider string `json:"provider" validate:"required"`
}

type OAuthCallbackRequest struct {
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
