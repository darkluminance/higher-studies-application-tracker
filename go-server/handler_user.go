package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
)

func (apiConfig *apiConfig) handlerCreateUser(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	user, err := apiConfig.DB.CreateUser(r.Context(), database.CreateUserParams{
		Name:     params.Name,
		Username: params.Username,
		Email:    params.Email,
		Password: params.Password,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error creating user: %v", err))
		return
	}

	respondWithJSON(w, 200, databaseUserToUser(user))
}

func (apiConfig *apiConfig) handlerGetUserByUsername(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Username string `json:"username"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	user, err := apiConfig.DB.GetUserByUsername(r.Context(), params.Username)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUserToUser(user))
}

func (apiConfig *apiConfig) handlerGetUserByToken(w http.ResponseWriter, r *http.Request, user database.User) {
	respondWithJSON(w, http.StatusOK, databaseUserToUser(user))
}

func (apiConfig *apiConfig) handlerGetUserByUsernameAndPassword(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")

	if authHeader == "" {
		respondWithError(w, http.StatusBadRequest, "Missing Authorization header")
		return
	}

	credentials := strings.SplitN(authHeader, ":", 2)
	if len(credentials) != 2 {
		respondWithError(w, http.StatusBadRequest, "Invalid Authorization header format. Expected 'username:password'")
		return
	}

	username := credentials[0]
	password := credentials[1]

	user, err := apiConfig.DB.GetUserByUsernameAndPassword(r.Context(), database.GetUserByUsernameAndPasswordParams{
		Username: username,
		Password: password,
	})
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Invalid Credentials")
		return
	}

	LoginHandler(w, r, user.Username)
}
