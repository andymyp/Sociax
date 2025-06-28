package models

import (
	"time"

	"github.com/google/uuid"
)

type AuthProvider struct {
    ID           uuid.UUID `gorm:"type:uuid;primaryKey"`
    UserID       uuid.UUID `gorm:"type:uuid;not null"`
    User         User      `gorm:"constraint:OnDelete:CASCADE"`
    Provider     string    `gorm:"type:varchar(20);not null" validate:"oneof=email google github"`
    ProviderID   string    `gorm:"not null"`
    AccessToken  *string
    RefreshToken *string

    CreatedAt    time.Time
    UpdatedAt    time.Time
}

type RefreshToken struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;not null"`
	User      User      `gorm:"constraint:OnDelete:CASCADE"`
	Token     string    `gorm:"uniqueIndex;not null"`
	Revoked   bool      `gorm:"default:false"`
	ExpiresAt time.Time
	
	CreatedAt time.Time
	UpdatedAt time.Time
}

type EmailOTP struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Email     string    `gorm:"uniqueIndex;not null" validate:"required,email"`
	OTP       string    `gorm:"not null"`
	ExpiresAt time.Time
	Used      bool      `gorm:"default:false"`
	CreatedAt time.Time
}

type SignUpRequest struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type EmailRequest struct {
	Email string `json:"email" validate:"required,email"`
}