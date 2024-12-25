-- name: CreateUniversity :one
INSERT INTO university (user_id, name, website, location, main_ranking, subject_ranking, application_deadline, early_deadline, is_gre_must, is_gmat_must, lor_count, is_official_transcript_required, is_transcript_needs_evaluation, accepted_evaluations)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
RETURNING *;

-- name: UpdateUniversityByID :one
UPDATE university 
SET name = $2,
    website = $3,
    location = $4,
    main_ranking = $5,
    subject_ranking = $6,
    application_deadline = $7,
    early_deadline = $8,
    is_gre_must = $9,
    is_gmat_must = $10,
    lor_count = $11,
    is_official_transcript_required = $12,
    is_transcript_needs_evaluation = $13,
    accepted_evaluations = $14,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: GetUniversitiesOfUser :many
SELECT * FROM university
WHERE user_id = $1;

-- name: GetUniversityById :one
SELECT * FROM university
WHERE id = $1;

-- name: DeleteUniversityById :one
DELETE FROM university
WHERE id = $1
RETURNING *;