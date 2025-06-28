package repository

import (
	"Sociax/shared-go/models"
	"strconv"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(user *models.User) error
	FindAll(filters map[string]string) (int64, []models.User, error)
	FindByID(id uuid.UUID) (*models.User, error)
	Update(user *models.User) error
	Delete(id uuid.UUID) error
	FindByEmail(email string) (*models.User, error)
}

type repo struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repo{db}
}

func (r *repo) Create(user *models.User) error {
	user.ID = uuid.New()
	return r.db.Create(user).Error
}

func (r *repo) FindAll(filters map[string]string) (int64, []models.User, error) {
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

func (r *repo) FindByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	
	return &user, err
}

func (r *repo) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *repo) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.User{}, "id = ?", id).Error
}

func (r *repo) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}