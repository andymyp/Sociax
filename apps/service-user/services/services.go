package services

import (
	"Sociax/service-user/repository"
	"Sociax/shared-go/models"
	"Sociax/shared-go/rabbitmq"
)

type Services interface {
	Create(user *models.User) (*rabbitmq.RPCError, error)
	FindByEmail(email string) (*models.User, error)
	Update(user *models.User) (*models.User, error)
}

type services struct {
	repo repository.Repository
}

func NewServices(r repository.Repository) Services {
	return &services{r}
}

func (s *services) Create(user *models.User) (*rabbitmq.RPCError, error) {
	check, _ := s.repo.FindByEmail(user.Email)

	if check != nil && check.Confirmed {
		err := &rabbitmq.RPCError{Message: "Email is already registered", Code: 409}
		return err, nil
	}

	if check != nil && !check.Confirmed {
		user.ID = check.ID
		user.CreatedAt = check.CreatedAt
		return nil, s.repo.Update(user)
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	provider := &models.AuthProvider{
		UserID:     user.ID,
		Provider:   "email",
		ProviderID: user.Email,
	}

	return nil, s.repo.CreateProvider(provider)
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
