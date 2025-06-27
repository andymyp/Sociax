package services

import (
	"Sociax/service-user/repository"
	"Sociax/shared-go/models"
)

type Services interface {
	Create(user *models.User) (int, error)
}

type services struct {
	repo repository.Repository
}

func NewServices(r repository.Repository) Services {
	return &services{r}
}

func (s *services) Create(user *models.User) (int, error) {
	check, _ := s.repo.FindByEmail(user.Email);

	if check != nil && check.Confirmed {
		return 0, nil
	}

	if check != nil && !check.Confirmed {
		user.ID = check.ID
		return 1, s.repo.Update(user)
	}

	return 1, s.repo.Create(user)
}
