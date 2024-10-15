package user_handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanush-128/openzo_backend/user/internal/middlewares"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"github.com/tanush-128/openzo_backend/user/internal/service"
)

type ItemHandler struct {
	itemService service.ItemService
}

func NewItemHandler(itemService *service.ItemService, router *gin.Engine) *ItemHandler {
	itemHandler := ItemHandler{itemService: *itemService}
	itemGroup := router.Group("/item")
	{
		itemGroup.POST("/", itemHandler.CreateItem)
		itemGroup.GET("/:id", itemHandler.GetItemByID)
		itemGroup.GET("/", itemHandler.GetAllItems)
		itemGroup.Use(middlewares.JwtMiddleware)
		itemGroup.PUT("/", itemHandler.UpdateItem)
		itemGroup.DELETE("/:id", itemHandler.DeleteItem)
	}

	return &itemHandler
}

func (h *ItemHandler) CreateItem(ctx *gin.Context) {
	var Item models.Item
	if err := ctx.BindJSON(&Item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdItem, err := h.itemService.CreateItem(ctx, Item)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, createdItem)

}

func (h *ItemHandler) GetItemByID(ctx *gin.Context) {
	id := ctx.Param("id")

	Item, err := h.itemService.GetItemByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, Item)
}

func (h *ItemHandler) GetAllItems(ctx *gin.Context) {
	queryParams := ctx.Request.URL.Query()
	log.Printf("Query params: %v", queryParams)
	items, err := h.itemService.GetAllItems(ctx, queryParams)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, items)
}

func (h *ItemHandler) UpdateItem(ctx *gin.Context) {
	var Item models.Item
	if err := ctx.BindJSON(&Item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedItem, err := h.itemService.UpdateItem(ctx, Item)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, updatedItem)
}

func (h *ItemHandler) DeleteItem(ctx *gin.Context) {
	id := ctx.Param("id")

	err := h.itemService.DeleteItem(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
}
