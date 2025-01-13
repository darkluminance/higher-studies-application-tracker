-- +goose Up

CREATE TYPE reply_vibe_enum AS ENUM ('ENTHUSIASTIC', 'GENERIC');

CREATE TABLE mail (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    faculty_id UUID UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    is_mailed BOOLEAN DEFAULT false,
    is_mail_replied BOOLEAN DEFAULT false,
    reply_vibe reply_vibe_enum,
    is_interview_requested BOOLEAN DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- +goose Down

DROP TABLE mail;
DROP TYPE reply_vibe_enum;