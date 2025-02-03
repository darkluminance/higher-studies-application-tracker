-- +goose Up
ALTER TABLE university
DROP COLUMN subject_ranking;

-- +goose Down
ALTER TABLE university
ADD COLUMN subject_ranking INTEGER;
