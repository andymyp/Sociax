package utils

import (
	"golang.org/x/crypto/bcrypt"
)

func Hashed(str string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(str), bcrypt.DefaultCost)
	return string(hashed)
}

func HashCompare(hashed, str string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(str))
}
