package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"github.com/tanush-128/openzo_backend/user/internal/service"
)

type LocationHandler struct {
	locationService service.LocationService
}

func NewLocationHandler(locationService *service.LocationService) *LocationHandler {
	return &LocationHandler{locationService: *locationService}
}

func (h *LocationHandler) CreateLocation(ctx *gin.Context) {
	var Location models.Location
	if err := ctx.BindJSON(&Location); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdLocation, err := h.locationService.CreateLocation(ctx, Location)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, createdLocation)

}

func (h *LocationHandler) GetLocationByID(ctx *gin.Context) {
	id := ctx.Param("id")

	Location, err := h.locationService.GetLocationByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, Location)
}

func (h *LocationHandler) GetAllLocations(ctx *gin.Context) {
	locations, err := h.locationService.GetAllLocations(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, locations)
}

func (h *LocationHandler) UpdateLocation(ctx *gin.Context) {
	var Location models.Location
	if err := ctx.BindJSON(&Location); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedLocation, err := h.locationService.UpdateLocation(ctx, Location)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, updatedLocation)
}

func (h *LocationHandler) DeleteLocation(ctx *gin.Context) {
	id := ctx.Param("id")

	err := h.locationService.DeleteLocation(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Location deleted successfully"})
}
