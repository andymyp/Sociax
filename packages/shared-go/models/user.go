package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	Name      string     `gorm:"type:varchar(200)" json:"name" validate:"required"`
	Email     string     `gorm:"uniqueIndex;not null" json:"email" validate:"required,email"`
	Username  string     `gorm:"uniqueIndex;size:20;not null" json:"username"`
	AvatarURL string     `gorm:"type:text" json:"avatar_url"`
	Birthday  *time.Time `gorm:"type:timestamptz" json:"birthday"`
	Gender    *string    `gorm:"type:varchar(8)" json:"gender"`
	Password  *string    `gorm:"type:text" json:"password,omitempty" validate:"required,min=6"`
	Bio       *string    `gorm:"type:text" json:"bio"`
	Confirmed bool       `gorm:"default:false" json:"confirmed"`
	Boarded   bool       `gorm:"default:false" json:"boarded"`
	Online    bool       `gorm:"default:false" json:"online"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`

	Providers []AuthProvider `gorm:"constraint:OnDelete:CASCADE" json:"providers,omitempty"`
}

func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	user.ID = uuid.New()
	return
}
