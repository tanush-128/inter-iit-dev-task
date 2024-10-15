package service

import (
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"github.com/tanush-128/openzo_backend/user/internal/repository"
)

type ItemService interface {

	//CRUD
	CreateItem(ctx *gin.Context, req models.Item) (models.Item, error)
	GetItemByID(ctx *gin.Context, id string) (models.Item, error)
	GetAllItems(ctx *gin.Context, queryParams url.Values) ([]models.Item, error)
	UpdateItem(ctx *gin.Context, req models.Item) (models.Item, error)
	DeleteItem(ctx *gin.Context, id string) error
}

type itemService struct {
	itemRepository repository.ItemRepository
}

func NewItemService(itemRepository repository.ItemRepository) ItemService {
	return &itemService{itemRepository: itemRepository}
}

func (s *itemService) CreateItem(ctx *gin.Context, req models.Item) (models.Item, error) {

	createdItem, err := s.itemRepository.CreateItem(req)
	if err != nil {
		return models.Item{}, err // Propagate error
	}

	return createdItem, nil
}

func (s *itemService) GetItemByID(ctx *gin.Context, id string) (models.Item, error) {
	item, err := s.itemRepository.GetItemByID(id)
	if err != nil {
		return models.Item{}, err
	}

	return item, nil
}

func (s *itemService) GetAllItems(ctx *gin.Context, queryParams url.Values) ([]models.Item, error) {
	items, err := s.itemRepository.GetAllItems(queryParams )
	if err != nil {
		return []models.Item{}, err
	}

	return items, nil
}

func (s *itemService) UpdateItem(ctx *gin.Context, req models.Item) (models.Item, error) {

	updatedItem, err := s.itemRepository.UpdateItem(req)
	if err != nil {
		return models.Item{}, err
	}

	return updatedItem, nil
}

func (s *itemService) DeleteItem(ctx *gin.Context, id string) error {
	err := s.itemRepository.DeleteItem(id)
	if err != nil {
		return err
	}

	return nil
}