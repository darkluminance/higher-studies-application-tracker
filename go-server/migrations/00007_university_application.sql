-- +goose Up

CREATE TYPE university_application_status_enum AS ENUM (
    'NOT APPLIED',
    'SKIPPED',
    'IN PROGRESS',
    'PENDING FEE',
    'APPLIED',
    'REJECTED',
    'ACCEPTED WITH FUND',
    'ACCEPTED WITHOUT FULL FUND'
);

CREATE TYPE application_type_enum AS ENUM ('MASTERS', 'PHD');

CREATE TABLE university_application (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    university_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE,
    shortlisted_faculties_id UUID[],
    recommenders_id UUID[],
    application_type application_type_enum DEFAULT 'PHD',
    application_status university_application_status_enum DEFAULT 'NOT APPLIED',
    language_score_submitted BOOLEAN DEFAULT false,
    gre_submitted BOOLEAN DEFAULT false,
    gmat_submitted BOOLEAN DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down

DROP TABLE university_application;
DROP TYPE university_application_status_enum;
DROP TYPE application_type_enum;