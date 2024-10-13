package models

import "time"

type User struct {
	ID        string  `gorm:"primaryKey" json:"id"`
	Email     *string `json:"email,omitempty"`
	Name      *string `json:"name,omitempty"`
	Password  *string `json:"password,omitempty"`
	CreatedAt time.Time
}

type Item struct {
	ID         string          `gorm:"primaryKey;unique" json:"item_id"`
	Name       *string         `json:"name,omitempty"`
	Quantity   *int            `json:"quantity,omitempty"`
	Category   *string         `json:"category,omitempty"`
	Price      *float64        `json:"price,omitempty"`
	Status     *string         `json:"status,omitempty"`
	GodownID   *string         `json:"godown_id,omitempty"`
	Brand      *string         `json:"brand,omitempty"`
	Attributes *ItemAttributes `gorm:"embedded" json:"attributes,omitempty"`
	ImageURL   *string         `json:"image_url,omitempty"`
}

type ItemAttributes struct {
	ID            uint    `gorm:"primaryKey;autoIncrement;unique" json:"id"`
	Type          *string `json:"type,omitempty"`
	Material      *string `json:"material,omitempty"`
	WarrantyYears *int    `json:"warranty_years,omitempty"`
}

type Location struct {
	ID           string  `gorm:"primaryKey" json:"id"`
	Name         *string `json:"name,omitempty"`
	ParentGodown *string `json:"parent_godown,omitempty"`
}
