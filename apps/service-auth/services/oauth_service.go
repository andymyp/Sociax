package services

import (
	"Sociax/service-auth/config"
	"Sociax/service-auth/helper"
	"Sociax/shared-go/models"
	"Sociax/shared-go/utils"
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"
	"time"

	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

func (s *services) SignInOAuth(req *models.OAuthRequest) string {
	var authUrl string

	state := url.QueryEscape(fmt.Sprintf("device_id=%s&device=%s", req.DeviceID, req.Device))

	if req.Provider == "google" {
		authUrl = config.GoogleOAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	}

	if req.Provider == "github" {
		authUrl = config.GitHubOAuthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	}

	return authUrl
}

func (s *services) SignInGoogleCallback(req *models.OAuthCallbackRequest) (*models.AuthResponse, error) {
	token, err := config.GoogleOAuthConfig.Exchange(context.Background(), req.Code)
	if err != nil {
		return nil, err
	}

	client := config.GoogleOAuthConfig.Client(context.Background(), token)

	res, err := helper.GetOAuthInfo(client, "https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}

	var googleRes *models.OAuthGoogleResponse
	if err := json.Unmarshal(res, &googleRes); err != nil {
		return nil, err
	}

	userData := &models.User{
		Name:      googleRes.Name,
		Email:     googleRes.Email,
		AvatarURL: googleRes.Picture,
		Confirmed: true,
	}

	userData.Username, err = s.GenerateUniqueUsername(googleRes.Email)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.UpsertUser(userData)
	if err != nil {
		return nil, err
	}

	provider := &models.AuthProvider{
		UserID:     user.ID,
		Provider:   "google",
		ProviderID: googleRes.ID,
	}

	if err := s.repo.CreateAuthProvider(provider); err != nil {
		return nil, err
	}

	user.Password = nil
	user.Providers = nil
	accessToken, err := helper.GenerateAccessToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken := utils.Hashed(uuid.NewString())

	rt := &models.RefreshToken{
		DeviceID:  req.DeviceID,
		Device:    req.Device,
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	if err := s.repo.CreateRefreshToken(rt); err != nil {
		return nil, err
	}

	authResponse := &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	return authResponse, nil
}

func (s *services) SignInGithubCallback(req *models.OAuthCallbackRequest) (*models.AuthResponse, error) {
	token, err := config.GitHubOAuthConfig.Exchange(context.Background(), req.Code)
	if err != nil {
		return nil, err
	}

	client := config.GitHubOAuthConfig.Client(context.Background(), token)

	resInfo, err := helper.GetOAuthInfo(client, "https://api.github.com/user")
	if err != nil {
		return nil, err
	}

	var githubRes *models.OAuthGithubResponse
	if err := json.Unmarshal(resInfo, &githubRes); err != nil {
		return nil, err
	}

	resEmails, err := helper.GetOAuthInfo(client, "https://api.github.com/user/emails")
	if err != nil {
		return nil, err
	}

	var resultEmails []map[string]interface{}
	if err := json.Unmarshal(resEmails, &resultEmails); err != nil {
		return nil, err
	}

	var primaryEmail string
	for _, emailEntry := range resultEmails {
		primary, ok := emailEntry["primary"].(bool)
		if ok && primary {
			if email, ok := emailEntry["email"].(string); ok {
				primaryEmail = email
				break
			}
		}
	}

	userData := &models.User{
		Name:      githubRes.Name,
		Email:     primaryEmail,
		AvatarURL: githubRes.AvatarUrl,
		Confirmed: true,
	}

	userData.Username, err = s.GenerateUniqueUsername(primaryEmail)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.UpsertUser(userData)
	if err != nil {
		return nil, err
	}

	provider := &models.AuthProvider{
		UserID:     user.ID,
		Provider:   "github",
		ProviderID: strconv.Itoa(githubRes.ID),
	}

	if err := s.repo.CreateAuthProvider(provider); err != nil {
		return nil, err
	}

	user.Password = nil
	user.Providers = nil
	accessToken, err := helper.GenerateAccessToken(user)
	if err != nil {
		return nil, err
	}

	refreshToken := utils.Hashed(uuid.NewString())

	rt := &models.RefreshToken{
		DeviceID:  req.DeviceID,
		Device:    req.Device,
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
	}

	if err := s.repo.CreateRefreshToken(rt); err != nil {
		return nil, err
	}

	authResponse := &models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	return authResponse, nil
}
