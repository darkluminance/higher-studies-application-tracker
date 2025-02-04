// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: university.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

const createUniversity = `-- name: CreateUniversity :one
INSERT INTO university (user_id, name, website, location, main_ranking, application_fee, application_deadline, early_deadline, is_gre_must, is_gmat_must, lor_count, is_official_transcript_required, is_transcript_needs_evaluation, accepted_evaluations, remarks)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
RETURNING id, user_id, name, website, location, main_ranking, application_fee, application_deadline, early_deadline, is_gre_must, is_gmat_must, lor_count, is_official_transcript_required, is_transcript_needs_evaluation, accepted_evaluations, remarks, created_at, updated_at
`

type CreateUniversityParams struct {
	UserID                       uuid.UUID
	Name                         string
	Website                      sql.NullString
	Location                     sql.NullString
	MainRanking                  sql.NullInt32
	ApplicationFee               sql.NullInt32
	ApplicationDeadline          sql.NullTime
	EarlyDeadline                sql.NullTime
	IsGreMust                    sql.NullBool
	IsGmatMust                   sql.NullBool
	LorCount                     sql.NullInt32
	IsOfficialTranscriptRequired sql.NullBool
	IsTranscriptNeedsEvaluation  sql.NullBool
	AcceptedEvaluations          []string
	Remarks                      sql.NullString
}

func (q *Queries) CreateUniversity(ctx context.Context, arg CreateUniversityParams) (University, error) {
	row := q.db.QueryRowContext(ctx, createUniversity,
		arg.UserID,
		arg.Name,
		arg.Website,
		arg.Location,
		arg.MainRanking,
		arg.ApplicationFee,
		arg.ApplicationDeadline,
		arg.EarlyDeadline,
		arg.IsGreMust,
		arg.IsGmatMust,
		arg.LorCount,
		arg.IsOfficialTranscriptRequired,
		arg.IsTranscriptNeedsEvaluation,
		pq.Array(arg.AcceptedEvaluations),
		arg.Remarks,
	)
	var i University
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Website,
		&i.Location,
		&i.MainRanking,
		&i.ApplicationFee,
		&i.ApplicationDeadline,
		&i.EarlyDeadline,
		&i.IsGreMust,
		&i.IsGmatMust,
		&i.LorCount,
		&i.IsOfficialTranscriptRequired,
		&i.IsTranscriptNeedsEvaluation,
		pq.Array(&i.AcceptedEvaluations),
		&i.Remarks,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteUniversityById = `-- name: DeleteUniversityById :one
DELETE FROM university
WHERE id = $1
RETURNING id, user_id, name, website, location, main_ranking, application_fee, application_deadline, early_deadline, is_gre_must, is_gmat_must, lor_count, is_official_transcript_required, is_transcript_needs_evaluation, accepted_evaluations, remarks, created_at, updated_at
`

func (q *Queries) DeleteUniversityById(ctx context.Context, id uuid.UUID) (University, error) {
	row := q.db.QueryRowContext(ctx, deleteUniversityById, id)
	var i University
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Website,
		&i.Location,
		&i.MainRanking,
		&i.ApplicationFee,
		&i.ApplicationDeadline,
		&i.EarlyDeadline,
		&i.IsGreMust,
		&i.IsGmatMust,
		&i.LorCount,
		&i.IsOfficialTranscriptRequired,
		&i.IsTranscriptNeedsEvaluation,
		pq.Array(&i.AcceptedEvaluations),
		&i.Remarks,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUniversitiesOfUser = `-- name: GetUniversitiesOfUser :many
SELECT id, user_id, name, website, location, main_ranking, application_fee, application_deadline, early_deadline, is_gre_must, is_gmat_must, lor_count, is_official_transcript_required, is_transcript_needs_evaluation, accepted_evaluations, remarks, created_at, updated_at FROM university
WHERE user_id = $1
`

func (q *Queries) GetUniversitiesOfUser(ctx context.Context, userID uuid.UUID) ([]University, error) {
	rows, err := q.db.QueryContext(ctx, getUniversitiesOfUser, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []University
	for rows.Next() {
		var i University
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Name,
			&i.Website,
			&i.Location,
			&i.MainRanking,
			&i.ApplicationFee,
			&i.ApplicationDeadline,
			&i.EarlyDeadline,
			&i.IsGreMust,
			&i.IsGmatMust,
			&i.LorCount,
			&i.IsOfficialTranscriptRequired,
			&i.IsTranscriptNeedsEvaluation,
			pq.Array(&i.AcceptedEvaluations),
			&i.Remarks,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUniversityById = `-- name: GetUniversityById :one
SELECT id, user_id, name, website, location, main_ranking, application_fee, application_deadline, early_deadline, is_gre_must, is_gmat_must, lor_count, is_official_transcript_required, is_transcript_needs_evaluation, accepted_evaluations, remarks, created_at, updated_at FROM university
WHERE id = $1
`

func (q *Queries) GetUniversityById(ctx context.Context, id uuid.UUID) (University, error) {
	row := q.db.QueryRowContext(ctx, getUniversityById, id)
	var i University
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Website,
		&i.Location,
		&i.MainRanking,
		&i.ApplicationFee,
		&i.ApplicationDeadline,
		&i.EarlyDeadline,
		&i.IsGreMust,
		&i.IsGmatMust,
		&i.LorCount,
		&i.IsOfficialTranscriptRequired,
		&i.IsTranscriptNeedsEvaluation,
		pq.Array(&i.AcceptedEvaluations),
		&i.Remarks,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateUniversityByID = `-- name: UpdateUniversityByID :one
UPDATE university 
SET name = $2,
    website = $3,
    location = $4,
    main_ranking = $5,
    application_fee = $6,
    application_deadline = $7,
    early_deadline = $8,
    is_gre_must = $9,
    is_gmat_must = $10,
    lor_count = $11,
    is_official_transcript_required = $12,
    is_transcript_needs_evaluation = $13,
    accepted_evaluations = $14,
    remarks = $15,
    updated_at = NOW()
WHERE id = $1
RETURNING id, user_id, name, website, location, main_ranking, application_fee, application_deadline, early_deadline, is_gre_must, is_gmat_must, lor_count, is_official_transcript_required, is_transcript_needs_evaluation, accepted_evaluations, remarks, created_at, updated_at
`

type UpdateUniversityByIDParams struct {
	ID                           uuid.UUID
	Name                         string
	Website                      sql.NullString
	Location                     sql.NullString
	MainRanking                  sql.NullInt32
	ApplicationFee               sql.NullInt32
	ApplicationDeadline          sql.NullTime
	EarlyDeadline                sql.NullTime
	IsGreMust                    sql.NullBool
	IsGmatMust                   sql.NullBool
	LorCount                     sql.NullInt32
	IsOfficialTranscriptRequired sql.NullBool
	IsTranscriptNeedsEvaluation  sql.NullBool
	AcceptedEvaluations          []string
	Remarks                      sql.NullString
}

func (q *Queries) UpdateUniversityByID(ctx context.Context, arg UpdateUniversityByIDParams) (University, error) {
	row := q.db.QueryRowContext(ctx, updateUniversityByID,
		arg.ID,
		arg.Name,
		arg.Website,
		arg.Location,
		arg.MainRanking,
		arg.ApplicationFee,
		arg.ApplicationDeadline,
		arg.EarlyDeadline,
		arg.IsGreMust,
		arg.IsGmatMust,
		arg.LorCount,
		arg.IsOfficialTranscriptRequired,
		arg.IsTranscriptNeedsEvaluation,
		pq.Array(arg.AcceptedEvaluations),
		arg.Remarks,
	)
	var i University
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Name,
		&i.Website,
		&i.Location,
		&i.MainRanking,
		&i.ApplicationFee,
		&i.ApplicationDeadline,
		&i.EarlyDeadline,
		&i.IsGreMust,
		&i.IsGmatMust,
		&i.LorCount,
		&i.IsOfficialTranscriptRequired,
		&i.IsTranscriptNeedsEvaluation,
		pq.Array(&i.AcceptedEvaluations),
		&i.Remarks,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
