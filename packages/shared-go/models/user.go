package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name      string    `gorm:"not null" validate:"required"`
	Email     string    `gorm:"uniqueIndex;not null" validate:"required,email"`
	Password  *string   `gorm:"type:text" json:"password,omitempty" validate:"required,min=6"`
	AvatarURL string    `gorm:"type:text"`
	Confirmed bool      `gorm:"default:false"`

	Providers []AuthProvider `gorm:"constraint:OnDelete:CASCADE" json:"providers,omitempty"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	user.ID = uuid.New()
	return
}
