-- name: CreateUniversityList :one
INSERT INTO university_list (user_id, name, university_ids)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUniversityListByID :one
SELECT * FROM university_list
WHERE id = $1;

-- name: DeleteUniversityListByID :one
DELETE FROM university_list
WHERE id = $1
RETURNING *;

-- name: UpdateUniversityListByID :one
UPDATE university_list
SET 
    name = $2,
    university_ids = $3,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: InsertUniversityIntoList :one
UPDATE university_list
SET 
    university_ids = ARRAY_APPEND(university_ids, $2),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteUniversityFromList :one
UPDATE university_list
SET 
    university_ids = ARRAY_REMOVE(university_ids, $2),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: GetUniversityListOfUser :many
SELECT * FROM university_list
WHERE user_id = $1;