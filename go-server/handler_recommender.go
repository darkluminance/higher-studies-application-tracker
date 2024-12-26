package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
	"github.com/google/uuid"
)

func (apiConfig *apiConfig) handlerCreateRecommender(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		Name         string    `json:"name"`
		Email        string    `json:"email"`
		Designation  string    `json:"designation"`
		Institution  string    `json:"institution"`
		Relationship string    `json:"relationship"`
		UserID       uuid.UUID `json:"user_id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	recommender, err := apiConfig.DB.CreateRecommender(r.Context(), database.CreateRecommenderParams{
		Name:         params.Name,
		Email:        params.Email,
		Designation:  ToNullString(params.Designation),
		Institution:  ToNullString(params.Institution),
		Relationship: ToNullString(params.Relationship),
		UserID:       user.ID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error creating recommender: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseRecommenderToRecommender(recommender))
}

func (apiConfig *apiConfig) handlerUpdateRecommenderByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID           uuid.UUID `json:"id"`
		Name         string    `json:"name"`
		Email        string    `json:"email"`
		Designation  string    `json:"designation"`
		Institution  string    `json:"institution"`
		Relationship string    `json:"relationship"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	recommender, err := apiConfig.DB.UpdateRecommenderByID(r.Context(), database.UpdateRecommenderByIDParams{
		ID:           params.ID,
		Name:         params.Name,
		Email:        params.Email,
		Designation:  ToNullString(params.Designation),
		Institution:  ToNullString(params.Institution),
		Relationship: ToNullString(params.Relationship),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error updating recommender: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseRecommenderToRecommender(recommender))
}

func (apiConfig *apiConfig) handlerGetRecommendersOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	recommenders, err := apiConfig.DB.GetRecommendersOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Recommender not found")
		return
	}

	var recommender_list []Recommender

	for _, recommender := range recommenders {
		recommender_list = append(recommender_list, databaseRecommenderToRecommender(recommender))
	}

	respondWithJSON(w, http.StatusOK, recommender_list)
}

func (apiConfig *apiConfig) handlerGetRecommenderByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	recommender, err := apiConfig.DB.GetRecommenderByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Recommender not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseRecommenderToRecommender(recommender))
}

func (apiConfig *apiConfig) handlerDeleteRecommenderByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	recommender, err := apiConfig.DB.DeleteRecommenderByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error deleting recommender: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseRecommenderToRecommender(recommender))
}
