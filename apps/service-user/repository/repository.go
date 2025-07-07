package repository

import (
	"Sociax/shared-go/models"
	"strconv"

	"gorm.io/gorm"
)

type Repository interface {
	GetByID(req *models.IDRequest) (*models.User, error)
	GetByEmail(req *models.EmailRequest) (*models.User, error)
	GetByUsername(req *models.UsernameRequest) (*models.User, error)
	Update(user *models.User) error
	GetAll(filters map[string]string) (int64, []models.User, error)
}

type repo struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repo{db}
}

func (r *repo) GetByID(req *models.IDRequest) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, req.ID).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &user, err
}

func (r *repo) GetByEmail(req *models.EmailRequest) (*models.User, error) {
	var user models.User
	err := r.db.Where("email=?", req.Email).First(&user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (r *repo) GetByUsername(req *models.UsernameRequest) (*models.User, error) {
	var user models.User
	err := r.db.Where("username=?", req.Username).First(&user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (r *repo) Update(user *models.User) error {
	var updatedUser *models.User
	err := r.db.Model(&updatedUser).Where("id=?", user.ID).Updates(user).Error
	if err != nil {
		return err
	}

	return nil
}

func (r *repo) GetAll(filters map[string]string) (int64, []models.User, error) {
	var data []models.User
	var count int64

	query := r.db.Model(&models.User{})

	if pageStr, ok1 := filters["page"]; ok1 {
		if limitStr, ok2 := filters["limit"]; ok2 {
			page, _ := strconv.Atoi(pageStr)
			limit, _ := strconv.Atoi(limitStr)

			offset := (page - 1) * limit
			query = query.Limit(limit).Offset(offset)
		}
	}

	query.Count(&count)

	err := query.Find(&data).Error

	return count, data, err
}
