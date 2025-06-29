package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthProvider struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID     uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	Provider   string    `gorm:"type:varchar(20);not null;index" json:"provider" validate:"oneof=email google github"`
	ProviderID string    `gorm:"not null" json:"provider_id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	User User `gorm:"constraint:OnDelete:CASCADE" json:"user,omitempty"`
}

func (authProvider *AuthProvider) BeforeCreate(tx *gorm.DB) (err error) {
	authProvider.ID = uuid.New()
	return
}

type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"user_id"`
	Token     string    `gorm:"uniqueIndex;not null" json:"token"`
	Revoked   bool      `gorm:"default:false" json:"revoked"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	User User `gorm:"constraint:OnDelete:CASCADE" json:"user,omitempty"`
}

func (refreshToken *RefreshToken) BeforeCreate(tx *gorm.DB) (err error) {
	refreshToken.ID = uuid.New()
	return
}

type EmailOTP struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email" validate:"required,email"`
	Type      uint      `gorm:"not null" json:"type" validate:"required"` // 0: sign-up, 1: forgot-password
	OTP       string    `gorm:"not null" json:"otp"`
	Used      bool      `gorm:"default:false" json:"used"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}

func (emailOTP *EmailOTP) BeforeCreate(tx *gorm.DB) (err error) {
	emailOTP.ID = uuid.New()
	return
}

type JwtClaims struct {
	*User
	jwt.RegisteredClaims
}

type EmailRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type OTPRequest struct {
	Email string `json:"email" validate:"required,email"`
	Type  uint   `json:"type" validate:"oneof=0 1"`
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

type ResetPasswordRequest struct {
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
}
