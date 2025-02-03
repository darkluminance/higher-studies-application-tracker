package main

import (
	"context"
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

	createNotificationAsInterview(apiConfig, r.Context(), params.Date, params.Time, user.Email, interview.ID)

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

	_, err = apiConfig.DB.DeleteNotificationByRefID(r.Context(), ToNullUUID(params.ID))
	if err != nil {
		fmt.Printf("Error while deleting notification: %v\n", err)
	}

	createNotificationAsInterview(apiConfig, r.Context(), params.Date, params.Time, user.Email, params.ID)

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

	_, err = apiConfig.DB.DeleteNotificationByRefID(r.Context(), ToNullUUID(params.ID))
	if err != nil {
		fmt.Printf("Error while deleting notification: %v\n", err)
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

func createNotificationAsInterview(apiConfig *apiConfig, ctx context.Context, date time.Time, timeStr string, email string, refID uuid.UUID) {
	if date.IsZero() {
		return
	}

	// Get the interview to find the faculty ID
	interview, err := apiConfig.DB.GetInterviewByID(ctx, refID)
	if err != nil {
		fmt.Printf("Failed to get interview details: %v", err)
		return
	}

	// Get the faculty details
	faculty, err := apiConfig.DB.GetFacultyByID(ctx, interview.FacultyID)
	if err != nil {
		fmt.Printf("Failed to get faculty details: %v", err)
		return
	}

	interviewTime := date
	if timeStr != "" {
		t, err := time.Parse("03:04 PM", timeStr)
		if err == nil {
			interviewTime = time.Date(
				date.Year(),
				date.Month(),
				date.Day(),
				t.Hour(),
				t.Minute(),
				0, 0,
				date.Location(),
			)
		}
	}

	// Create notification for 1 day before
	message := fmt.Sprintf("Dear User, you have an interview scheduled with %s for tomorrow at %s.\n\nRegards,\nTrackGrad system",
		faculty.Name,
		interviewTime.Format("3:04 PM, January 2, 2006"))

	_, err = apiConfig.DB.CreateNotification(ctx, database.CreateNotificationParams{
		UserEmail:  email,
		EventTime:  interviewTime,
		NotifyTime: interviewTime.AddDate(0, 0, -1),
		NotificationType: database.NullNotificationsTypeEnum{
			NotificationsTypeEnum: database.NotificationsTypeEnumINTERVIEW,
			Valid:                 true,
		},
		NotificationRefID: ToNullUUID(refID),
		Message:           message,
	})
	if err != nil {
		fmt.Printf("Failed to create notification: %v", err)
	}

	// Create notification for 1 hour before
	message = fmt.Sprintf("Dear User, your interview with %s is scheduled in 1 hour at %s.\n\nRegards,\nTrackGrad system",
		faculty.Name,
		interviewTime.Format("3:04 PM, January 2, 2006"))

	_, err = apiConfig.DB.CreateNotification(ctx, database.CreateNotificationParams{
		UserEmail:  email,
		EventTime:  interviewTime,
		NotifyTime: interviewTime.Add(-1 * time.Hour),
		NotificationType: database.NullNotificationsTypeEnum{
			NotificationsTypeEnum: database.NotificationsTypeEnumINTERVIEW,
			Valid:                 true,
		},
		NotificationRefID: ToNullUUID(refID),
		Message:           message,
	})
	if err != nil {
		fmt.Printf("Failed to create notification: %v", err)
	}
}
