package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/darkluminance/gotutorial/internal/database"
	"github.com/google/uuid"
)

func (apiConfig *apiConfig) handlerCreateUniversityList(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		Name          string   `json:"name"`
		UserID        string   `json:"user_id"`
		UniversityIDs []string `json:"university_ids"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	university_list, err := apiConfig.DB.CreateUniversityList(r.Context(), database.CreateUniversityListParams{
		Name:          params.Name,
		UserID:        user.ID,
		UniversityIds: convertStringArrayToUUIDArray(params.UniversityIDs),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create university list: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseUniversityListToUniversityList(university_list))
}

func (apiConfig *apiConfig) handlerGetUniversityListsOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	university_lists, err := apiConfig.DB.GetUniversityListOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "UniversityList not found")
		return
	}

	var universitylists []UniversityList

	for _, universitylist := range university_lists {
		universitylists = append(universitylists, databaseUniversityListToUniversityList(universitylist))
	}

	respondWithJSON(w, http.StatusOK, universitylists)
}

func (apiConfig *apiConfig) handlerGetUniversityListByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID     uuid.UUID `json:"id"`
		UserID uuid.UUID `json:"user_id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	universityList, err := apiConfig.DB.GetUniversityListByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "UniversityList not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityListToUniversityList(universityList))
}

func (apiConfig *apiConfig) handlerUpdateUniversityListByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID            uuid.UUID `json:"id"`
		Name          string    `json:"name"`
		UniversityIDs []string  `json:"university_ids"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	universityList, err := apiConfig.DB.UpdateUniversityListByID(r.Context(), database.UpdateUniversityListByIDParams{
		ID:            params.ID,
		Name:          params.Name,
		UniversityIds: convertStringArrayToUUIDArray(params.UniversityIDs),
	})
	if err != nil {
		respondWithError(w, http.StatusNotFound, "UniversityList not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityListToUniversityList(universityList))
}

func (apiConfig *apiConfig) handlerDeleteUniversityListByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID     uuid.UUID `json:"id"`
		UserID uuid.UUID `json:"user_id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	universityList, err := apiConfig.DB.DeleteUniversityListByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error deleting UniversityList: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityListToUniversityList(universityList))
}

func (apiConfig *apiConfig) handlerInsertUniversityIntoList(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID           uuid.UUID `json:"id"`
		UniversityID uuid.UUID `json:"university_id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	universityList, err := apiConfig.DB.InsertUniversityIntoList(r.Context(), database.InsertUniversityIntoListParams{
		ID:          params.ID,
		ArrayAppend: params.UniversityID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error inserting University into List: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityListToUniversityList(universityList))
}

func (apiConfig *apiConfig) handlerRemoveUniversityFromLists(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	university_lists, err := apiConfig.DB.GetUniversityListOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "UniversityList not found")
		return
	}

	for _, university := range university_lists {
		_, err := apiConfig.DB.DeleteUniversityFromList(r.Context(), database.DeleteUniversityFromListParams{
			ID:          university.ID,
			ArrayRemove: params.ID,
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error removing University from Lists: %v", err))
			return
		}
	}

	respondWithJSON(w, http.StatusOK, map[string]string{"message": "Successfully deleted"})
}
