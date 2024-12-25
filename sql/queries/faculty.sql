-- name: CreateFaculty :one
INSERT INTO faculty (user_id, name, email, university_id, designation, research_areas, interested_papers)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateFacultyByID :one
UPDATE faculty
SET 
    name = $2,
    email = $3,
    university_id = $4,
    designation = $5,
    research_areas = $6,
    interested_papers = $7,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: GetFacultysOfUser :many
SELECT * FROM faculty
WHERE user_id = $1;

-- name: GetFacultyByID :one
SELECT * FROM faculty
WHERE id = $1;

-- name: DeleteFacultyByID :one
DELETE FROM faculty
WHERE id = $1
RETURNING *;