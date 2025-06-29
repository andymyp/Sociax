package repository

import (
	"Sociax/shared-go/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	CreateUser(user *models.User) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	UpdateUser(user *models.User) error
	CreateOTP(emailOTP *models.EmailOTP) error
	GetOTP(req *models.OTPRequest) (*models.EmailOTP, error)
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

func (r *repo) CreateUser(user *models.User) (*models.User, error) {
	if err := r.db.Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *repo) GetUserByEmail(email string) (*models.User, error) {
	var user *models.User
	err := r.db.Where("email=?", email).First(&user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

func (r *repo) UpdateUser(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *repo) CreateOTP(emailOTP *models.EmailOTP) error {
	return r.db.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "email"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"type", "otp", "used", "expires_at", "created_at",
		}),
	}).Create(emailOTP).Error
}

func (r *repo) GetOTP(req *models.OTPRequest) (*models.EmailOTP, error) {
	var emailOTP *models.EmailOTP
	err := r.db.Where("email=? AND type=? AND used=?", req.Email, req.Type, false).First(&emailOTP).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return emailOTP, err
}

func (r *repo) UpdateOTP(emailOTP *models.EmailOTP) error {
	return r.db.Save(emailOTP).Error
}

func (r *repo) CreateAuthProvider(authProvider *models.AuthProvider) error {
	return r.db.Create(authProvider).Error
}

func (r *repo) CreateRefreshToken(refreshToken *models.RefreshToken) error {
	return r.db.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "user_id"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"token", "revoked", "expires_at", "created_at",
		}),
	}).Create(refreshToken).Error
}
