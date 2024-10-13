package main

import (
	"fmt"

	"github.com/tanush-128/openzo_backend/user/config"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func connectToDB(cfg *config.Config) (*gorm.DB, error) {

	db := &gorm.DB{}
	err := error(nil)
	if cfg.MODE == "production" {
		dsn := cfg.DB_URL

		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			return nil, fmt.Errorf("failed to open database connection: %w", err)
		}
		fmt.Println("Connected to database in production mode")
	} else {

		db, err = gorm.Open(
			sqlite.Open("test.db"),

			&gorm.Config{},
		)
		if err != nil {
			return nil, fmt.Errorf("failed to open database connection: %w", err)
		}
	}

	db.Migrator().AutoMigrate(&models.User{})
	db.Migrator().AutoMigrate(&models.Item{})
	db.Migrator().AutoMigrate(&models.ItemAttributes{})

	db.Migrator().AutoMigrate(&models.Location{})

	return db, nil
}
