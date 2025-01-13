-- +goose Up

CREATE TABLE recommender (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    name TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    designation VARCHAR(50),
    institution VARCHAR(100),
    relationship VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down

DROP TABLE recommender;