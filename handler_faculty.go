package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/darkluminance/gotutorial/internal/database"
	"github.com/google/uuid"
)

func (apiConfig *apiConfig) handlerCreateFaculty(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		Name             string    `json:"name"`
		Email            string    `json:"email"`
		Designation      string    `json:"designation"`
		UniversityID     uuid.UUID `json:"university_id"`
		ResearchAreas    []string  `json:"research_areas"`
		InterestedPapers []string  `json:"interested_papers"`
		UserID           uuid.UUID `json:"user_id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	faculty, err := apiConfig.DB.CreateFaculty(r.Context(), database.CreateFacultyParams{
		Name:             params.Name,
		Email:            ToNullString(params.Email),
		UniversityID:     params.UniversityID,
		Designation:      params.Designation,
		ResearchAreas:    params.ResearchAreas,
		InterestedPapers: params.InterestedPapers,
		UserID:           user.ID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error creating faculty: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseFacultyToFaculty(faculty))
}

func (apiConfig *apiConfig) handlerUpdateFacultyByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID               uuid.UUID `json:"id"`
		Name             string    `json:"name"`
		Email            string    `json:"email"`
		UniversityID     uuid.UUID `json:"university_id"`
		Designation      string    `json:"designation"`
		ResearchAreas    []string  `json:"research_areas"`
		InterestedPapers []string  `json:"interested_papers"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	faculty, err := apiConfig.DB.UpdateFacultyByID(r.Context(), database.UpdateFacultyByIDParams{
		ID:               params.ID,
		Name:             params.Name,
		Email:            ToNullString(params.Email),
		UniversityID:     params.UniversityID,
		Designation:      params.Designation,
		ResearchAreas:    params.ResearchAreas,
		InterestedPapers: params.InterestedPapers,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error updating faculty: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseFacultyToFaculty(faculty))
}

func (apiConfig *apiConfig) handlerGetFacultiesOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	facultys, err := apiConfig.DB.GetFacultysOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Faculty not found")
		return
	}

	var faculty_list []Faculty

	for _, faculty := range facultys {
		faculty_list = append(faculty_list, databaseFacultyToFaculty(faculty))
	}

	respondWithJSON(w, http.StatusOK, faculty_list)
}

func (apiConfig *apiConfig) handlerGetFacultyByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	faculty, err := apiConfig.DB.GetFacultyByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Faculty not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseFacultyToFaculty(faculty))
}

func (apiConfig *apiConfig) handlerDeleteFacultyByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	faculty, err := apiConfig.DB.DeleteFacultyByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error deleting faculty: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseFacultyToFaculty(faculty))
}
