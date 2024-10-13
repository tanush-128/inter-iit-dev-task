package service

import (
	"github.com/gin-gonic/gin"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"github.com/tanush-128/openzo_backend/user/internal/repository"
	"github.com/tanush-128/openzo_backend/user/internal/utils"
)

type UserService interface {

	//CRUD
	CreateUser(ctx *gin.Context, req models.User) (models.User, string, error)
	GetUserByID(ctx *gin.Context, id string) (models.User, error)
	GetUserByEmail(ctx *gin.Context, email string) (models.User, error)
	UpdateUser(ctx *gin.Context, req models.User) (models.User, error)

	//Authentication
	UserSignIn(ctx *gin.Context, req UserSignInRequest) (string, error)
	GetUserWithJWT(ctx *gin.Context, token string) (models.User, error)
}

type userService struct {
	userRepository repository.UserRepository
}

func NewUserService(userRepository repository.UserRepository) UserService {
	return &userService{userRepository: userRepository}
}

func (s *userService) CreateUser(ctx *gin.Context, req models.User) (models.User, string, error) {

	hashedPassword, err := utils.HashPassword(*req.Password)
	if err != nil {
		return models.User{}, "", err
	}

	req.Password = &hashedPassword

	createdUser, err := s.userRepository.CreateUser(req)
	if err != nil {
		return models.User{}, "", err // Propagate error
	}

	token, err := CreateJwtToken(createdUser.ID)
	if err != nil {
		return models.User{}, "", err
	}

	return createdUser, token, nil
}

func (s *userService) GetUserByID(ctx *gin.Context, id string) (models.User, error) {
	user, err := s.userRepository.GetUserByID(id)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (s *userService) GetUserByEmail(ctx *gin.Context, email string) (models.User, error) {
	user, err := s.userRepository.GetUserByEmail(email)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (s *userService) UpdateUser(ctx *gin.Context, req models.User) (models.User, error) {

	var user models.User

	user, err := s.userRepository.GetUserByID(req.ID)
	if err != nil {
		return models.User{}, err
	}

	req.Password = user.Password

	updatedUser, err := s.userRepository.UpdateUser(req)
	if err != nil {
		return models.User{}, err
	}

	return updatedUser, nil
}
