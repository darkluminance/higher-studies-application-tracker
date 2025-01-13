package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
	"github.com/google/uuid"
)

func (apiConfig *apiConfig) handlerCreateInterview(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		FacultyID   uuid.UUID `json:"faculty_id"`
		Date        time.Time `json:"date"`
		Time        string    `json:"time"`
		IsCompleted bool      `json:"is_completed"`
		Remarks     string    `json:"remarks"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	interview, err := apiConfig.DB.CreateInterview(r.Context(), database.CreateInterviewParams{
		UserID:      user.ID,
		FacultyID:   params.FacultyID,
		Date:        ToNullTime(params.Date),
		Time:        stringToNullTime(params.Time),
		IsCompleted: ToNullBoolean(params.IsCompleted),
		Remarks:     ToNullString(params.Remarks),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't create interview: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseInterviewToInterview(interview))
}

func (apiConfig *apiConfig) handlerGetInterviewsOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	interviews, err := apiConfig.DB.GetInterviewsOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Recommender not found")
		return
	}

	var interview_list []Interview

	for _, interview := range interviews {
		interview_list = append(interview_list, databaseInterviewToInterview(interview))
	}

	respondWithJSON(w, http.StatusOK, interview_list)
}

func (apiConfig *apiConfig) handlerGetInterviewByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	interview, err := apiConfig.DB.GetInterviewByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Recommender not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseInterviewToInterview(interview))
}

func (apiConfig *apiConfig) handlerUpdateInterviewByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID          uuid.UUID `json:"id"`
		FacultyID   uuid.UUID `json:"faculty_id"`
		Date        time.Time `json:"date"`
		Time        string    `json:"time"`
		IsCompleted bool      `json:"is_completed"`
		Remarks     string    `json:"remarks"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	interview, err := apiConfig.DB.UpdateInterviewByID(r.Context(), database.UpdateInterviewByIDParams{
		ID:          params.ID,
		FacultyID:   params.FacultyID,
		Date:        ToNullTime(params.Date),
		Time:        stringToNullTime(params.Time),
		IsCompleted: ToNullBoolean(params.IsCompleted),
		Remarks:     ToNullString(params.Remarks),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't update interview: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseInterviewToInterview(interview))
}

func (apiConfig *apiConfig) handlerDeleteInterviewByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	interview, err := apiConfig.DB.DeleteInterviewByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't delete interview: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseInterviewToInterview(interview))
}

func (apiConfig *apiConfig) handlerGetInterviewsOfUserByFacultyID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		FacultyID uuid.UUID `json:"faculty_id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	interviews, err := apiConfig.DB.GetInterviewsOfUserByFaculty(r.Context(), database.GetInterviewsOfUserByFacultyParams{
		UserID:    user.ID,
		FacultyID: params.FacultyID,
	})
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Faculty not found")
		return
	}

	var interview_list []Interview

	for _, interview := range interviews {
		interview_list = append(interview_list, databaseInterviewToInterview(interview))
	}

	respondWithJSON(w, http.StatusOK, interview_list)
}
