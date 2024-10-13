package middlewares

import (
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func JwtMiddleware(c *gin.Context) {
	//get the token from the header
	token := c.GetHeader("Authorization")
	log.Println(token)
	if token == "" {
		c.JSON(401, gin.H{"error": "Authorization header is required"})
		c.Abort()
		return

	}
	tokenSplit := strings.Split(token, " ")
	if len(tokenSplit) < 2 {
		c.JSON(401, gin.H{"error": "Invalid token"})
		c.Abort()
		return
	}
	token = tokenSplit[1]

	//validate the token
	claims, err := ValidateJwtToken(token)
	if err != nil {

		c.JSON(401, gin.H{"error": "Invalid token"})
		c.Abort()
		return
	}

	//set the user in the context
	c.Set("user", claims)
	c.Next()
}

func ValidateJwtToken(token string) (map[string]interface{}, error) {
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret"), nil
	})
	if err != nil {
		return nil, err
	}
	// if claims["exp"].(float64) < float64(time.Now().Unix()) {
	// 	return nil, err
	// }
	return claims, nil
}
