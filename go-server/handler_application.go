package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
	"github.com/google/uuid"
)

func (apiConfig *apiConfig) handlerCreateUniversityApplication(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		UniversityID           uuid.UUID   `json:"university_id"`
		ApplicationType        string      `json:"application_type"`
		ShortlistedFacultiesID []uuid.UUID `json:"shortlisted_faculties_id"`
		RecommendersID         []uuid.UUID `json:"recommenders_id"`
		ApplicationStatus      string      `json:"application_status"`
		LanguageScoreSubmitted bool        `json:"language_score_submitted"`
		GreSubmitted           bool        `json:"gre_submitted"`
		GmatSubmitted          bool        `json:"gmat_submitted"`
		Remarks                string      `json:"remarks"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	application, err := apiConfig.DB.CreateUniversityApplication(r.Context(), database.CreateUniversityApplicationParams{
		UserID:                 user.ID,
		UniversityID:           params.UniversityID,
		ShortlistedFacultiesID: params.ShortlistedFacultiesID,
		RecommendersID:         params.RecommendersID,
		ApplicationStatus:      ToNullApplicationStatusEnum(params.ApplicationStatus),
		LanguageScoreSubmitted: ToNullBoolean(params.LanguageScoreSubmitted),
		GreSubmitted:           ToNullBoolean(params.GreSubmitted),
		GmatSubmitted:          ToNullBoolean(params.GmatSubmitted),
		Remarks:                ToNullString(params.Remarks),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't create application: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseUniversityApplicationToUniversityApplication(application))
}

func (apiConfig *apiConfig) handlerGetUniversityApplicationsOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	applications, err := apiConfig.DB.GetUniversityApplicationsOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "University Applications not found")
		return
	}

	var application_list []UniversityApplication
	for _, application := range applications {
		application_list = append(application_list, databaseUniversityApplicationToUniversityApplication(application))
	}

	respondWithJSON(w, http.StatusOK, application_list)
}

func (apiConfig *apiConfig) handlerGetUniversityApplicationByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	application, err := apiConfig.DB.GetUniversityApplicationById(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "UniversityApplication not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityApplicationToUniversityApplication(application))
}

func (apiConfig *apiConfig) handlerUpdateUniversityApplicationByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID                     uuid.UUID   `json:"id"`
		UniversityID           uuid.UUID   `json:"university_id"`
		ApplicationType        string      `json:"application_type"`
		ShortlistedFacultiesID []uuid.UUID `json:"shortlisted_faculties_id"`
		RecommendersID         []uuid.UUID `json:"recommenders_id"`
		ApplicationStatus      string      `json:"application_status"`
		LanguageScoreSubmitted bool        `json:"language_score_submitted"`
		GreSubmitted           bool        `json:"gre_submitted"`
		GmatSubmitted          bool        `json:"gmat_submitted"`
		Remarks                string      `json:"remarks"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	application, err := apiConfig.DB.UpdateUniversityApplicationByID(r.Context(), database.UpdateUniversityApplicationByIDParams{
		ID:                     params.ID,
		UniversityID:           params.UniversityID,
		ApplicationType:        ToNullApplicationTypeEnum(params.ApplicationType),
		ShortlistedFacultiesID: params.ShortlistedFacultiesID,
		RecommendersID:         params.RecommendersID,
		ApplicationStatus:      ToNullApplicationStatusEnum(params.ApplicationStatus),
		LanguageScoreSubmitted: ToNullBoolean(params.LanguageScoreSubmitted),
		GreSubmitted:           ToNullBoolean(params.GreSubmitted),
		GmatSubmitted:          ToNullBoolean(params.GmatSubmitted),
		Remarks:                ToNullString(params.Remarks),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't update application: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityApplicationToUniversityApplication(application))
}

func (apiConfig *apiConfig) handlerDeleteUniversityApplicationByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	application, err := apiConfig.DB.DeleteUniversityApplicationById(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't delete application: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseUniversityApplicationToUniversityApplication(application))
}
