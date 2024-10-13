package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/tanush-128/openzo_backend/user/config"
	handlers "github.com/tanush-128/openzo_backend/user/internal/api"
	"github.com/tanush-128/openzo_backend/user/internal/middlewares"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"gorm.io/gorm"

	"github.com/tanush-128/openzo_backend/user/internal/repository"
	"github.com/tanush-128/openzo_backend/user/internal/service"
)

func main() {

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal(fmt.Errorf("failed to load config: %w", err))
	}

	db, err := connectToDB(cfg) // Implement database connection logic
	if err != nil {
		log.Fatal(fmt.Errorf("failed to connect to database: %w", err))
	}

	userRepository := repository.NewUserRepository(db)
	itemRepository := repository.NewItemRepository(db)
	locationRepository := repository.NewLocationRepository(db)

	userService := service.NewUserService(userRepository)
	itemService := service.NewItemService(itemRepository)
	locationService := service.NewLocationService(locationRepository)

	// Initialize HTTP server with Gin
	router := gin.Default()
	handler := handlers.NewHandler(&userService)
	itemHandler := handlers.NewItemHandler(&itemService)
	locationHandler := handlers.NewLocationHandler(&locationService)

	addItemsData(db)
	// addLocationsData(db)

	router.Use(corsMiddleware())

	itemGroup := router.Group("/item")
	{
		itemGroup.POST("/", itemHandler.CreateItem)
		itemGroup.GET("/:id", itemHandler.GetItemByID)
		itemGroup.GET("/", itemHandler.GetAllItems)
		itemGroup.PUT("/", itemHandler.UpdateItem)
	}
	// location route group
	locationGroup := router.Group("/location")
	{
		locationGroup.POST("/", locationHandler.CreateLocation)
		locationGroup.GET("/:id", locationHandler.GetLocationByID)
		locationGroup.GET("/", locationHandler.GetAllLocations)
		locationGroup.PUT("/", locationHandler.UpdateLocation)
	}
	// user route group
	userGroup := router.Group("/user")
	{
		userGroup.POST("/", handler.CreateUser)
		userGroup.POST("/signin", handler.UserSignIn)
		userGroup.PUT("/", handler.UpdateUser)
		userGroup.Use(middlewares.JwtMiddleware)

		userGroup.GET("/jwt", handler.GetUserWithJWT)
	}

	// item route group

	// Start server
	router.Run(fmt.Sprintf(":%s", cfg.HTTPPort))

}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	}
}

func addLocationsData(db *gorm.DB) {
	jsonFile, err := os.Open("godowns.json")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened items.json")
	defer jsonFile.Close()

	var locations []models.Location
	err = json.NewDecoder(jsonFile).Decode(&locations)
	if err != nil {
		fmt.Println(err)
	}
	db.Migrator().DropTable(&models.Location{})
	db.Migrator().AutoMigrate(&models.Location{})
	db.Create(&locations)

	fmt.Println("Items added to database")

}

func addItemsData(db *gorm.DB) {
	jsonFile, err := os.Open("items.json")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Successfully Opened items.json")
	defer jsonFile.Close()

	var items []models.Item
	err = json.NewDecoder(jsonFile).Decode(&items)
	if err != nil {
		fmt.Println(err)
	}
	db.Migrator().DropTable(&models.Item{})
	db.Migrator().DropTable(&models.ItemAttributes{})
	db.Migrator().AutoMigrate(&models.ItemAttributes{})
	db.Migrator().AutoMigrate(&models.Item{})

	db.Create(&items)

	fmt.Println("Items added to database")

}
