package repository

import (
	"Sociax/shared-go/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	CreateOTP(emailOTP *models.EmailOTP) error
	FindOTP(email string) (*models.EmailOTP, error)
	UpdateOTP(emailOTP *models.EmailOTP) error
	CreateAuthProvider(authProvider *models.AuthProvider) error
	CreateRefreshToken(refreshToken *models.RefreshToken) error
}

type repo struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repo{db}
}

func (r *repo) CreateOTP(emailOTP *models.EmailOTP) error {
	return r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "email"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"type", "otp", "expires_at", "used", "created_at",
		}),
	}).Create(emailOTP).Error
	
}

func (r *repo) FindOTP(email string) (*models.EmailOTP, error) {
	var emailOTP models.EmailOTP
	err := r.db.Where("email = ?", email).First(&emailOTP).Error
	return &emailOTP, err
}

func (r *repo) UpdateOTP(emailOTP *models.EmailOTP) error {
	return r.db.Save(emailOTP).Error
}

func (r *repo) CreateAuthProvider(authProvider *models.AuthProvider) error {
	return r.db.Create(authProvider).Error
}

func (r *repo) CreateRefreshToken(refreshToken *models.RefreshToken) error {
	return r.db.Create(refreshToken).Error
}