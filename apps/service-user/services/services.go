package services

import (
	"Sociax/service-user/repository"
	"Sociax/shared-go/models"
)

type Services interface {
	GetByID(req *models.IDRequest) (*models.User, error)
	GetByEmail(req *models.EmailRequest) (*models.User, error)
	GetByUsername(req *models.UsernameRequest) (*models.User, error)
	Update(user *models.User) (*models.User, error)
	GetAll(filters map[string]string) (int64, []models.User, error)
}

type services struct {
	repo repository.Repository
}

func NewServices(r repository.Repository) Services {
	return &services{r}
}

func (s *services) GetByID(req *models.IDRequest) (*models.User, error) {
	return s.repo.GetByID(req)
}

func (s *services) GetByEmail(req *models.EmailRequest) (*models.User, error) {
	return s.repo.GetByEmail(req)
}

func (s *services) GetByUsername(req *models.UsernameRequest) (*models.User, error) {
	return s.repo.GetByUsername(req)
}

func (s *services) Update(user *models.User) (*models.User, error) {
	return s.repo.Update(user)
}

func (s *services) GetAll(filters map[string]string) (int64, []models.User, error) {
	return s.repo.GetAll(filters)
}
