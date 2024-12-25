-- name: CreateRecommender :one
INSERT INTO recommender (user_id, name, email, designation, relationship)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateRecommenderByID :one
UPDATE recommender
SET 
    name = $2,
    email = $3,
    designation = $4,
    relationship = $5,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: GetRecommendersOfUser :many
SELECT * FROM recommender
WHERE user_id = $1;

-- name: GetRecommenderByID :one
SELECT * FROM recommender
WHERE id = $1;

-- name: DeleteRecommenderByID :one
DELETE FROM recommender
WHERE id = $1
RETURNING *;