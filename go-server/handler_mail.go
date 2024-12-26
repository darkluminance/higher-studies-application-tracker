package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
	"github.com/google/uuid"
)

func (apiConfig *apiConfig) handlerCreateMail(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		FacultyID            uuid.UUID `json:"faculty_id"`
		IsMailed             bool      `json:"is_mailed"`
		IsMailReplied        bool      `json:"is_mail_replied"`
		ReplyVibe            string    `json:"reply_vibe"`
		IsInterviewRequested bool      `json:"is_interview_requested"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	mail, err := apiConfig.DB.CreateMail(r.Context(), database.CreateMailParams{
		UserID:               user.ID,
		FacultyID:            params.FacultyID,
		IsMailed:             ToNullBoolean(params.IsMailed),
		IsMailReplied:        ToNullBoolean(params.IsMailReplied),
		ReplyVibe:            ToNullReplyVibeEnum(params.ReplyVibe),
		IsInterviewRequested: ToNullBoolean(params.IsInterviewRequested),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't create mail: %v", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, databaseMailToMailWithID(mail))
}

func (apiConfig *apiConfig) handlerGetMailsOfUser(w http.ResponseWriter, r *http.Request, user database.User) {
	mails, err := apiConfig.DB.GetMailsOfUser(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Mails not found")
		return
	}

	var mail_list []Mail
	for _, mail := range mails {
		mail_list = append(mail_list, databaseMailToMailWithName(database.GetMailByIDRow{
			UserID:               mail.UserID,
			FacultyName:          mail.FacultyName,
			IsMailed:             mail.IsMailed,
			IsMailReplied:        mail.IsMailReplied,
			ReplyVibe:            mail.ReplyVibe,
			IsInterviewRequested: mail.IsInterviewRequested,
		}))
	}

	respondWithJSON(w, http.StatusOK, mail_list)
}

func (apiConfig *apiConfig) handlerGetMailByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	mail, err := apiConfig.DB.GetMailByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Mail not found")
		return
	}

	respondWithJSON(w, http.StatusOK, databaseMailToMailWithName(database.GetMailByIDRow{
		UserID:               mail.UserID,
		FacultyName:          mail.FacultyName,
		IsMailed:             mail.IsMailed,
		IsMailReplied:        mail.IsMailReplied,
		ReplyVibe:            mail.ReplyVibe,
		IsInterviewRequested: mail.IsInterviewRequested,
	}))
}

func (apiConfig *apiConfig) handlerUpdateMailByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID                   uuid.UUID `json:"id"`
		FacultyID            uuid.UUID `json:"faculty_id"`
		IsMailed             bool      `json:"is_mailed"`
		IsMailReplied        bool      `json:"is_mail_replied"`
		ReplyVibe            string    `json:"reply_vibe"`
		IsInterviewRequested bool      `json:"is_interview_requested"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	mail, err := apiConfig.DB.UpdateMailByID(r.Context(), database.UpdateMailByIDParams{
		ID:                   params.ID,
		FacultyID:            params.FacultyID,
		IsMailed:             ToNullBoolean(params.IsMailed),
		IsMailReplied:        ToNullBoolean(params.IsMailReplied),
		ReplyVibe:            ToNullReplyVibeEnum(params.ReplyVibe),
		IsInterviewRequested: ToNullBoolean(params.IsInterviewRequested),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't update mail: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseMailToMailWithID(mail))
}

func (apiConfig *apiConfig) handlerDeleteMailByID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		ID uuid.UUID `json:"id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	mail, err := apiConfig.DB.DeleteMailByID(r.Context(), params.ID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't delete mail: %v", err))
		return
	}

	respondWithJSON(w, http.StatusOK, databaseMailToMailWithID(mail))
}

func (apiConfig *apiConfig) handlerGetMailsOfUserByFacultyID(w http.ResponseWriter, r *http.Request, user database.User) {
	type parameters struct {
		FacultyID uuid.UUID `json:"faculty_id"`
	}
	params := parameters{}

	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, fmt.Sprintf("Invalid request payload: %v", err))
		return
	}

	mails, err := apiConfig.DB.GetMailsOfUserByFaculty(r.Context(), database.GetMailsOfUserByFacultyParams{
		UserID:    user.ID,
		FacultyID: params.FacultyID,
	})
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Mails not found")
		return
	}

	var mail_list []Mail
	for _, mail := range mails {
		mail_list = append(mail_list, databaseMailToMailWithName(database.GetMailByIDRow{
			UserID:               mail.UserID,
			FacultyName:          mail.FacultyName,
			IsMailed:             mail.IsMailed,
			IsMailReplied:        mail.IsMailReplied,
			ReplyVibe:            mail.ReplyVibe,
			IsInterviewRequested: mail.IsInterviewRequested,
		}))
	}

	respondWithJSON(w, http.StatusOK, mail_list)
}

func (apiConfig *apiConfig) handlerGetEnumValues(w http.ResponseWriter, r *http.Request, user database.User) {
	enumName := r.URL.Query().Get("enum_name")
	if enumName == "" {
		respondWithError(w, http.StatusBadRequest, "enum_name parameter is required")
		return
	}

	enumValues, err := apiConfig.DB.GetEnumByName(r.Context(), enumName)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't get enum values")
		return
	}

	respondWithJSON(w, http.StatusOK, enumValues)
}
