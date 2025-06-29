package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthProvider struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID     uuid.UUID `gorm:"type:uuid;not null;index"`
	User       User      `gorm:"constraint:OnDelete:CASCADE" json:"user,omitempty"`
	Provider   string    `gorm:"type:varchar(20);not null;index" validate:"oneof=email google github"`
	ProviderID string    `gorm:"not null"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (authProvider *AuthProvider) BeforeCreate(tx *gorm.DB) (err error) {
	authProvider.ID = uuid.New()
	return
}

type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;uniqueIndex;not null"`
	User      User      `gorm:"constraint:OnDelete:CASCADE" json:"user,omitempty"`
	Token     string    `gorm:"uniqueIndex;not null"`
	Revoked   bool      `gorm:"default:false"`
	ExpiresAt time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (refreshToken *RefreshToken) BeforeCreate(tx *gorm.DB) (err error) {
	refreshToken.ID = uuid.New()
	return
}

type EmailOTP struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Email     string    `gorm:"uniqueIndex;not null" validate:"required,email"`
	Type      uint      `gorm:"not null" validate:"required"` // 0: sign-up, 1: forgot-password
	OTP       string    `gorm:"not null"`
	Used      bool      `gorm:"default:false"`
	ExpiresAt time.Time
	CreatedAt time.Time
}

func (emailOTP *EmailOTP) BeforeCreate(tx *gorm.DB) (err error) {
	emailOTP.ID = uuid.New()
	return
}

type OTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	Type  uint   `json:"type" validate:"oneof=0 1"`
}

type EmailRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type VerifyOTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	Type  uint   `json:"type" validate:"oneof=0 1"`
	OTP   string `json:"otp" validate:"required,min=6"`
}

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
