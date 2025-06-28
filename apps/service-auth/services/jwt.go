package services

import (
	"Sociax/shared-go/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JwtClaims struct {
	models.User
	jwt.RegisteredClaims
}

var jwtSecret []byte

func InitJWT(secret string) {
	jwtSecret = []byte(secret)
}

func GenerateAccessToken(user models.User) (string, error) {
	claims := JwtClaims{
		User: user,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ParseToken(tokenStr string) (*jwt.Token, error) {
	return jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
}
