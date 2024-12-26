package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(username string) (string, error) {
	jwtSecretKey := []byte(os.Getenv("SECRET_KEY"))
	if jwtSecretKey == nil {
		log.Fatal("SECRET_KEY must be set in the environment:")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 1).Unix(),
	})

	return token.SignedString(jwtSecretKey)
}

func ParseJWT(w http.ResponseWriter, tokenString string) (string, error) {
	jwtSecretKey := []byte(os.Getenv("SECRET_KEY"))
	if jwtSecretKey == nil {
		log.Fatal("SECRET_KEY must be set in the environment:")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecretKey, nil
	})
	if err != nil || !token.Valid {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username := claims["username"].(string)
		return username, nil
	}

	return "", errors.New("Invalid token")
}

func LoginHandler(w http.ResponseWriter, r *http.Request, username string) {
	token, err := GenerateJWT(username)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"token": token})
}
