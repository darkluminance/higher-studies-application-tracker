-- +goose Up

CREATE TABLE faculty (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE,
    university_id UUID NOT NULL,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE,
    designation VARCHAR(255) NOT NULL,
    research_areas TEXT[],
    interested_papers TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down

DROP TABLE faculty;
