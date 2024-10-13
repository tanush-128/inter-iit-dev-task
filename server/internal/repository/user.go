package repository

import (
	"github.com/google/uuid"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user models.User) (models.User, error)
	GetUserByID(id string) (models.User, error)
	GetUserByEmail(email string) (models.User, error)
	UpdateUser(user models.User) (models.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {

	return &userRepository{db: db}
}

func (r *userRepository) CreateUser(user models.User) (models.User, error) {

	user.ID = uuid.New().String()

	tx := r.db.Create(&user)

	if tx.Error != nil {
		return models.User{}, tx.Error
	}

	return user, nil
}

func (r *userRepository) GetUserByID(id string) (models.User, error) {
	var user models.User
	tx := r.db.Where("id = ?", id).First(&user)
	if tx.Error != nil {
		return models.User{}, tx.Error
	}

	return user, nil
}

func (r *userRepository) GetUserByEmail(email string) (models.User, error) {
	var user models.User
	tx := r.db.Where("email = ?", email).First(&user)
	if tx.Error != nil {
		return models.User{}, tx.Error
	}

	return user, nil
}

func (r *userRepository) UpdateUser(user models.User) (models.User, error) {
	tx := r.db.Save(&user)
	if tx.Error != nil {
		return models.User{}, tx.Error
	}

	return user, nil
}
