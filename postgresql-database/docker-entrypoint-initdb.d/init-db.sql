CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

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

CREATE TABLE interview (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    faculty_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

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
    is_submitted BOOLEAN DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recommender_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES university_application(id) ON DELETE CASCADE,
    recommender_id UUID NOT NULL REFERENCES recommender(id) ON DELETE CASCADE,
    is_LOR_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION remove_deleted_faculty()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE university_application
    SET shortlisted_faculties_id = array_remove(shortlisted_faculties_id, OLD.id)
    WHERE OLD.id = ANY(shortlisted_faculties_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_deleted_recommender()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE university_application
    SET recommenders_id = array_remove(recommenders_id, OLD.id)
    WHERE OLD.id = ANY(recommenders_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_delete_faculty
AFTER DELETE ON faculty
FOR EACH ROW
EXECUTE FUNCTION remove_deleted_faculty();

CREATE TRIGGER on_delete_recommender
AFTER DELETE ON recommender
FOR EACH ROW
EXECUTE FUNCTION remove_deleted_recommender();
