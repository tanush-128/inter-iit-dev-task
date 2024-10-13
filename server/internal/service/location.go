package service

import (
	"github.com/gin-gonic/gin"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"github.com/tanush-128/openzo_backend/user/internal/repository"
)

type LocationService interface {

	//CRUD
	CreateLocation(ctx *gin.Context, req models.Location) (models.Location, error)
	GetLocationByID(ctx *gin.Context, id string) (models.Location, error)
	GetAllLocations(ctx *gin.Context) ([]models.Location, error)
	UpdateLocation(ctx *gin.Context, req models.Location) (models.Location, error)
	DeleteLocation(ctx *gin.Context, id string) error
}

type locationService struct {
	locationRepository repository.LocationRepository
}

func NewLocationService(locationRepository repository.LocationRepository) LocationService {
	return &locationService{locationRepository: locationRepository}
}

func (s *locationService) CreateLocation(ctx *gin.Context, req models.Location) (models.Location, error) {

	createdLocation, err := s.locationRepository.CreateLocation(req)
	if err != nil {
		return models.Location{}, err // Propagate error
	}

	return createdLocation, nil
}

func (s *locationService) GetLocationByID(ctx *gin.Context, id string) (models.Location, error) {
	location, err := s.locationRepository.GetLocationByID(id)
	if err != nil {
		return models.Location{}, err
	}

	return location, nil
}

func (s *locationService) GetAllLocations(ctx *gin.Context) ([]models.Location, error) {
	locations, err := s.locationRepository.GetAllLocations()
	if err != nil {
		return []models.Location{}, err
	}

	return locations, nil
}

func (s *locationService) UpdateLocation(ctx *gin.Context, req models.Location) (models.Location, error) {

	updatedLocation, err := s.locationRepository.UpdateLocation(req)
	if err != nil {
		return models.Location{}, err
	}

	return updatedLocation, nil
}

func (s *locationService) DeleteLocation(ctx *gin.Context, id string) error {
	err := s.locationRepository.DeleteLocation(id)
	return err
}
