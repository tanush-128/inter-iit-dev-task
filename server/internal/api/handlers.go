package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanush-128/openzo_backend/user/internal/middlewares"
	"github.com/tanush-128/openzo_backend/user/internal/models"
	"github.com/tanush-128/openzo_backend/user/internal/service"
)

type UserHandler struct {
	userService service.UserService
}

func NewUserHandler(userService *service.UserService, router *gin.Engine) *UserHandler {
	handler := UserHandler{userService: *userService}

	userGroup := router.Group("/user")
	{
		userGroup.POST("/", handler.CreateUser)
		userGroup.POST("/signin", handler.UserSignIn)
		userGroup.Use(middlewares.JwtMiddleware)
		userGroup.PUT("/", handler.UpdateUser)
		userGroup.GET("/jwt", handler.GetUserWithJWT)
	}
	return &handler
}

func (h *UserHandler) CreateUser(ctx *gin.Context) {
	var user models.User
	if err := ctx.BindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdUser, token, err := h.userService.CreateUser(ctx, user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"user":  createdUser,
		"token": token,
	})
}

func (h *UserHandler) GetUserByID(ctx *gin.Context) {
	id := ctx.Param("id")

	user, err := h.userService.GetUserByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (h *UserHandler) GetUserByEmail(ctx *gin.Context) {
	email := ctx.Param("email")

	user, err := h.userService.GetUserByEmail(ctx, email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateUser(ctx *gin.Context) {
	var user models.User
	if err := ctx.BindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedUser, err := h.userService.UpdateUser(ctx, user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, updatedUser)
}

func (h *UserHandler) UserSignIn(ctx *gin.Context) {
	var user service.UserSignInRequest
	if err := ctx.BindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.userService.UserSignIn(ctx, user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *UserHandler) GetUserWithJWT(ctx *gin.Context) {
	token := ctx.GetHeader("Authorization")

	user, err := h.userService.GetUserWithJWT(ctx, token)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

// Add more handlers for other user operations (GetUser, UpdateUser, etc.)
