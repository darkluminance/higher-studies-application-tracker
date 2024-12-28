CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recommender (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    designation VARCHAR(50),
    institution VARCHAR(100),
    relationship VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recommender_status (
    recommender UUID NOT NULL REFERENCES recommender(id) ON DELETE CASCADE,
    PRIMARY KEY (recommender),
    is_LOR_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE faculty (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(50) UNIQUE,
    university_id UUID NOT NULL,
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
    faculty_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    is_mailed BOOLEAN DEFAULT false,
    is_mail_replied BOOLEAN DEFAULT false,
    reply_vibe reply_vibe_enum,
    is_interview_requested BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE university (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(20),
    location TEXT,  
    main_ranking INTEGER,
    subject_ranking INTEGER,
    application_deadline DATE,
    early_deadline DATE,
    is_gre_must BOOLEAN DEFAULT false,
    is_gmat_must BOOLEAN DEFAULT false,
    lor_count INTEGER DEFAULT 0,
    is_official_transcript_required BOOLEAN DEFAULT false,
    is_transcript_needs_evaluation BOOLEAN DEFAULT false,
    accepted_evaluations TEXT[],
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

CREATE TABLE university_application (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    university_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES university(id) ON DELETE CASCADE,
    shortlisted_faculties_id UUID[],
    recommenders_id UUID[],
    application_status university_application_status_enum DEFAULT 'NOT APPLIED',
    language_score_submitted BOOLEAN DEFAULT false,
    gre_submitted BOOLEAN DEFAULT false,
    gmat_submitted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);