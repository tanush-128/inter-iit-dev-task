package repository

import (
	"github.com/google/uuid"
	"github.com/tanush-128/openzo_backend/user/internal/models"

	"gorm.io/gorm"
)

type ItemRepository interface {
	CreateItem(item models.Item) (models.Item, error)
	GetItemByID(id string) (models.Item, error)
	GetAllItems() ([]models.Item, error)
	UpdateItem(item models.Item) (models.Item, error)
}

type itemRepository struct {
	db *gorm.DB
}

func NewItemRepository(db *gorm.DB) ItemRepository {

	return &itemRepository{db: db}
}

func (r *itemRepository) CreateItem(item models.Item) (models.Item, error) {

	item.ID = uuid.New().String()

	tx := r.db.Create(&item)

	if tx.Error != nil {
		return models.Item{}, tx.Error
	}

	return item, nil
}

func (r *itemRepository) GetItemByID(id string) (models.Item, error) {
	var item models.Item
	tx := r.db.Where("id = ?", id).First(&item)
	if tx.Error != nil {
		return models.Item{}, tx.Error
	}

	return item, nil
}

func (r *itemRepository) GetAllItems() ([]models.Item, error) {
	var items []models.Item
	tx := r.db.Find(&items)
	if tx.Error != nil {
		return []models.Item{}, tx.Error
	}

	return items, nil
}

func (r *itemRepository) UpdateItem(item models.Item) (models.Item, error) {
	tx := r.db.Save(&item)
	if tx.Error != nil {
		return models.Item{}, tx.Error
	}

	return item, nil
}
