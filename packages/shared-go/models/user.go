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
	Password  *string   `gorm:"type:text"`
	AvatarURL string    `gorm:"type:text"`
	Confirmed	bool      `gorm:"default:false"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}