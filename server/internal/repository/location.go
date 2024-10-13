package repository

import (
	"github.com/google/uuid"
	"github.com/tanush-128/openzo_backend/user/internal/models"

	"gorm.io/gorm"
)

type LocationRepository interface {
	CreateLocation(location models.Location) (models.Location, error)
	GetLocationByID(id string) (models.Location, error)
	GetAllLocations() ([]models.Location, error)
	UpdateLocation(location models.Location) (models.Location, error)
}

type locationRepository struct {
	db *gorm.DB
}

func NewLocationRepository(db *gorm.DB) LocationRepository {

	return &locationRepository{db: db}
}

func (r *locationRepository) CreateLocation(location models.Location) (models.Location, error) {

	location.ID = uuid.New().String()

	tx := r.db.Create(&location)

	if tx.Error != nil {
		return models.Location{}, tx.Error
	}

	return location, nil
}

func (r *locationRepository) GetLocationByID(id string) (models.Location, error) {
	var location models.Location
	tx := r.db.Where("id = ?", id).First(&location)
	if tx.Error != nil {
		return models.Location{}, tx.Error
	}

	return location, nil
}

func (r *locationRepository) GetAllLocations() ([]models.Location, error) {
	var locations []models.Location
	tx := r.db.Find(&locations)
	if tx.Error != nil {
		return []models.Location{}, tx.Error
	}

	return locations, nil
}

func (r *locationRepository) UpdateLocation(location models.Location) (models.Location, error) {
	tx := r.db.Save(&location)
	if tx.Error != nil {
		return models.Location{}, tx.Error
	}

	return location, nil
}
