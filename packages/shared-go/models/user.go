package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name" validate:"required"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email" validate:"required,email"`
	Birthday  time.Time `gorm:"type:timestamptz;not null" json:"birthday" validate:"required"`
	Gender    string    `gorm:"type:varchar(8);not null" json:"gender" validate:"required,oneof=male female"`
	Bio       string    `gorm:"type:text" json:"bio"`
	Password  *string   `gorm:"type:text" json:"password,omitempty" validate:"required,min=6"`
	AvatarURL string    `gorm:"type:text" json:"avatar_url"`
	Confirmed bool      `gorm:"default:false" json:"confirmed"`
	Online    bool      `gorm:"default:false" json:"online"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Providers []AuthProvider `gorm:"constraint:OnDelete:CASCADE" json:"providers,omitempty"`
}

func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	user.ID = uuid.New()
	return
}
