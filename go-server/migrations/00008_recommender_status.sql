-- +goose Up

CREATE TABLE recommender_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES university_application(id) ON DELETE CASCADE,
    recommender_id UUID NOT NULL REFERENCES recommender(id) ON DELETE CASCADE,
    is_LOR_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- +goose Down

DROP TABLE recommender_status;