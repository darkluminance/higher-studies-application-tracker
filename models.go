package main

import (
	"time"

	"github.com/darkluminance/gotutorial/internal/database"
	"github.com/google/uuid"
)

// Structs

type User struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Recommender struct {
	ID           uuid.UUID `json:"id"`
	UserID       uuid.UUID `json:"user_id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Designation  string    `json:"designation"`
	Relationship string    `json:"relationship"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Faculty struct {
	ID               uuid.UUID `json:"id"`
	UserID           uuid.UUID `json:"user_id"`
	Name             string    `json:"name"`
	Email            string    `json:"email"`
	UniversityID     uuid.UUID `json:"university_id"`
	Designation      string    `json:"designation"`
	ResearchAreas    []string  `json:"research_areas"`
	InterestedPapers []string  `json:"interested_papers"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type University struct {
	ID                           uuid.UUID `json:"id"`
	UserID                       uuid.UUID `json:"user_id"`
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
	CreatedAt                    time.Time `json:"created_at"`
	UpdatedAt                    time.Time `json:"updated_at"`
}

type UniversityList struct {
	ID            uuid.UUID   `json:"id"`
	UserID        uuid.UUID   `json:"user_id"`
	Name          string      `json:"name"`
	UniversityIDs []uuid.UUID `json:"university_ids"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
}

// Functions
func databaseUserToUser(databaseUser database.User) User {
	return User{
		ID:        databaseUser.ID,
		Name:      databaseUser.Name,
		Username:  databaseUser.Username,
		Email:     databaseUser.Email,
		CreatedAt: databaseUser.CreatedAt.Time,
		UpdatedAt: databaseUser.UpdatedAt.Time,
	}
}

func databaseUniversityToUniversity(databaseUniversity database.University) University {
	return University{
		ID:                           databaseUniversity.ID,
		UserID:                       databaseUniversity.UserID,
		Name:                         databaseUniversity.Name,
		Website:                      databaseUniversity.Website.String,
		Location:                     databaseUniversity.Location.String,
		MainRanking:                  int(databaseUniversity.MainRanking.Int32),
		SubjectRanking:               int(databaseUniversity.SubjectRanking.Int32),
		ApplicationDeadline:          databaseUniversity.ApplicationDeadline.Time,
		EarlyDeadline:                databaseUniversity.EarlyDeadline.Time,
		IsGreMust:                    databaseUniversity.IsGreMust.Bool,
		IsGmatMust:                   databaseUniversity.IsGmatMust.Bool,
		LorCount:                     int(databaseUniversity.LorCount.Int32),
		IsOfficialTranscriptRequired: databaseUniversity.IsOfficialTranscriptRequired.Bool,
		IsTranscriptNeedsEvaluation:  databaseUniversity.IsTranscriptNeedsEvaluation.Bool,
		AcceptedEvaluations:          databaseUniversity.AcceptedEvaluations,
		CreatedAt:                    databaseUniversity.CreatedAt.Time,
		UpdatedAt:                    databaseUniversity.UpdatedAt.Time,
	}
}

func databaseUniversityListToUniversityList(databaseUniversityList database.UniversityList) UniversityList {
	return UniversityList{
		ID:            databaseUniversityList.ID,
		UserID:        databaseUniversityList.UserID,
		Name:          databaseUniversityList.Name,
		UniversityIDs: databaseUniversityList.UniversityIds,
		CreatedAt:     databaseUniversityList.CreatedAt.Time,
		UpdatedAt:     databaseUniversityList.UpdatedAt.Time,
	}
}

func databaseRecommenderToRecommender(databaseRecommender database.Recommender) Recommender {
	return Recommender{
		ID:           databaseRecommender.ID,
		UserID:       databaseRecommender.UserID,
		Name:         databaseRecommender.Name,
		Email:        databaseRecommender.Email,
		Designation:  databaseRecommender.Designation.String,
		Relationship: databaseRecommender.Relationship.String,
		CreatedAt:    databaseRecommender.CreatedAt.Time,
		UpdatedAt:    databaseRecommender.UpdatedAt.Time,
	}
}

func databaseFacultyToFaculty(databaseFaculty database.Faculty) Faculty {
	return Faculty{
		ID:               databaseFaculty.ID,
		UserID:           databaseFaculty.UserID,
		Name:             databaseFaculty.Name,
		Email:            databaseFaculty.Email.String,
		UniversityID:     databaseFaculty.UniversityID,
		Designation:      databaseFaculty.Designation,
		ResearchAreas:    databaseFaculty.ResearchAreas,
		InterestedPapers: databaseFaculty.InterestedPapers,
		CreatedAt:        databaseFaculty.CreatedAt.Time,
		UpdatedAt:        databaseFaculty.UpdatedAt.Time,
	}
}
