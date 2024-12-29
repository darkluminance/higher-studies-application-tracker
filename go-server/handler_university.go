package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
	"github.com/google/uuid"
)

func (apiConfig *apiConfig) handlerCreateUniversity(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		Name                         string    `json:"name"`
		UserID                       string    `json:"user_id"`
		Website                      string    `json:"website"`
		Location                     string    `json:"location"`
		MainRanking                  int       `json:"main_ranking"`
		SubjectRanking               int       `json:"subject_ranking"`
		ApplicationDeadline          time.Time `json:"application_deadline"`
		EarlyDeadline                time.Time `json:"early_deadline"`
		IsGreMust                    bool      `json:"is_gre_must"`
		IsGmatMust                   bool      `json:"is_gmat_must"`
		LorCount                     int       `json:"lor_count"`
		IsOfficialTranscriptRequired bool      `json:"is_official_transcript_required"`
		IsTranscriptNeedsEvaluation  bool      `json:"is_transcript_needs_evaluation"`
		AcceptedEvaluations          []string  `json:"accepted_evaluations"`
		Remarks                      string    `json:"remarks"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	university, err := apiConfig.DB.CreateUniversity(r.Context(), database.CreateUniversityParams{
		Name:                         params.Name,
		UserID:                       user.ID,
		Website:                      ToNullString(params.Website),
		Location:                     ToNullString(params.Location),
		MainRanking:                  ToNullInt(params.MainRanking),
		SubjectRanking:               ToNullInt(params.SubjectRanking),
		ApplicationDeadline:          ToNullTime(params.ApplicationDeadline),
		EarlyDeadline:                ToNullTime(params.EarlyDeadline),
		IsGreMust:                    ToNullBoolean(params.IsGreMust),
		IsGmatMust:                   ToNullBoolean(params.IsGmatMust),
		LorCount:                     ToNullInt(params.LorCount),
		IsOfficialTranscriptRequired: ToNullBoolean(params.IsOfficialTranscriptRequired),
		IsTranscriptNeedsEvaluation:  ToNullBoolean(params.IsTranscriptNeedsEvaluation),
		AcceptedEvaluations:          params.AcceptedEvaluations,
		Remarks:                      ToNullString(params.Remarks),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to create university: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseUniversityToUniversity(university))
}

func (apiConfig *apiConfig) handlerUpdateUniversityByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID                           uuid.UUID `json:"id"`
		Name                         string    `json:"name"`
		Website                      string    `json:"website"`
		Location                     string    `json:"location"`
		MainRanking                  int       `json:"main_ranking"`
		SubjectRanking               int       `json:"subject_ranking"`
		ApplicationDeadline          time.Time `json:"application_deadline"`
		EarlyDeadline                time.Time `json:"early_deadline"`
		IsGreMust                    bool      `json:"is_gre_must"`
		IsGmatMust                   bool      `json:"is_gmat_must"`
		LorCount                     int       `json:"lor_count"`
		IsOfficialTranscriptRequired bool      `json:"is_official_transcript_required"`
		IsTranscriptNeedsEvaluation  bool      `json:"is_transcript_needs_evaluation"`
		AcceptedEvaluations          []string  `json:"accepted_evaluations"`
		Remarks                      string    `json:"remarks"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	university, err := apiConfig.DB.UpdateUniversityByID(r.Context(), database.UpdateUniversityByIDParams{
		ID:                           params.ID,
		Name:                         params.Name,
		Website:                      ToNullString(params.Website),
		Location:                     ToNullString(params.Location),
		MainRanking:                  ToNullInt(params.MainRanking),
		SubjectRanking:               ToNullInt(params.SubjectRanking),
		ApplicationDeadline:          ToNullTime(params.ApplicationDeadline),
		EarlyDeadline:                ToNullTime(params.EarlyDeadline),
		IsGreMust:                    ToNullBoolean(params.IsGreMust),
		IsGmatMust:                   ToNullBoolean(params.IsGmatMust),
		LorCount:                     ToNullInt(params.LorCount),
		IsOfficialTranscriptRequired: ToNullBoolean(params.IsOfficialTranscriptRequired),
		IsTranscriptNeedsEvaluation:  ToNullBoolean(params.IsTranscriptNeedsEvaluation),
		AcceptedEvaluations:          params.AcceptedEvaluations,
		Remarks:                      ToNullString(params.Remarks),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Failed to update university: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseUniversityToUniversity(university))
}

func (apiConfig *apiConfig) handlerGetUniversitiesOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	university_list, err := apiConfig.DB.GetUniversitiesOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "University not found")
		return
	}

	var universitylist []University

	for _, university := range university_list {
		universitylist = append(universitylist, databaseUniversityToUniversity(university))
	}

	respondWithJSON(w, http.StatusOK, universitylist)
}

func (apiConfig *apiConfig) handlerGetUniversityByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	university, err := apiConfig.DB.GetUniversityById(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "University not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityToUniversity(university))
}

func (apiConfig *apiConfig) handlerDeleteUniversityByID(w http.ResponseWriter, r *http.Request, user database.User) {
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

	university, err := apiConfig.DB.DeleteUniversityById(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error deleting University: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityToUniversity(university))
}
