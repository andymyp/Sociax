package utils

import (
	"fmt"
	"math/rand"

	"golang.org/x/crypto/bcrypt"
)

func GenerateOTP() string {
	return fmt.Sprintf("%06d", rand.Intn(1000000));
}

func Hashed(str string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(str), bcrypt.DefaultCost)
	return string(hashed)
}