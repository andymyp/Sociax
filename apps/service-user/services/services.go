package services

import (
	"Sociax/service-user/repository"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
)

type Services interface {
	Create(user *models.User) (*models.User, *rabbitmq.RPCError, error)
	FindByEmail(email string) (*models.User, error)
	Update(user *models.User) (*models.User, error)
}

type services struct {
	repo repository.Repository
}

func NewServices(r repository.Repository) Services {
	return &services{r}
}

func (s *services) Create(user *models.User) (*models.User, *rabbitmq.RPCError, error) {
	check, _ := s.repo.FindByEmail(user.Email)

	if check != nil && check.Confirmed {
		err := &rabbitmq.RPCError{Message: "Email is already registered", Code: 409}
		return nil, err, nil
	}

	if check != nil && !check.Confirmed {
		user.ID = check.ID
		user.CreatedAt = check.CreatedAt

		if err := s.repo.Update(user); err != nil {
			return nil, nil, err
		}
	}

	if check == nil {
		if err := s.repo.Create(user); err != nil {
			return nil, nil, err
		}
	}

	res, err := s.repo.FindByEmail(user.Email)
	return res, nil, err
}

func (s *services) FindByEmail(email string) (*models.User, error) {
	return s.repo.FindByEmail(email)
}

func (s *services) Update(user *models.User) (*models.User, error) {
	if err := s.repo.Update(user); err != nil {
		return nil, err
	}

	return s.repo.FindByID(user.ID)
}
