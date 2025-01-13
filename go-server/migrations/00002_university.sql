-- +goose Up

CREATE TABLE university (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(100),
    location TEXT,
    main_ranking INTEGER,
    subject_ranking INTEGER,
    application_fee INTEGER,
    application_deadline DATE,
    early_deadline DATE,
    is_gre_must BOOLEAN DEFAULT false,
    is_gmat_must BOOLEAN DEFAULT false,
    lor_count INTEGER DEFAULT 0,
    is_official_transcript_required BOOLEAN DEFAULT false,
    is_transcript_needs_evaluation BOOLEAN DEFAULT false,
    accepted_evaluations TEXT[],
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down

DROP TABLE university;
