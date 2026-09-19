CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    display_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1200,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN')),
    CONSTRAINT chk_users_rating CHECK (rating >= 0)
);

CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(160) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    input_format TEXT NOT NULL,
    output_format TEXT NOT NULL,
    constraints TEXT NOT NULL,
    examples_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    sample_input TEXT NOT NULL,
    sample_output TEXT NOT NULL,
    acceptance_rate NUMERIC(5, 2) NOT NULL,
    time_limit_ms INTEGER NOT NULL,
    memory_limit_mb INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_problems_difficulty CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    CONSTRAINT chk_problems_acceptance_rate CHECK (acceptance_rate >= 0 AND acceptance_rate <= 100),
    CONSTRAINT chk_problems_time_limit CHECK (time_limit_ms > 0),
    CONSTRAINT chk_problems_memory_limit CHECK (memory_limit_mb > 0)
);

CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES problems (id) ON DELETE CASCADE,
    input_data TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL,
    CONSTRAINT chk_test_cases_display_order CHECK (display_order > 0)
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems (id) ON DELETE CASCADE,
    language VARCHAR(30) NOT NULL,
    source_code TEXT NOT NULL,
    status VARCHAR(40) NOT NULL,
    runtime_ms INTEGER,
    memory_kb INTEGER,
    queue_key VARCHAR(120),
    queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failure_message TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_submissions_language CHECK (language IN ('JAVA', 'CPP', 'PYTHON', 'JAVASCRIPT')),
    CONSTRAINT chk_submissions_status CHECK (status IN ('PENDING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'RUNTIME_ERROR')),
    CONSTRAINT chk_submissions_runtime CHECK (runtime_ms IS NULL OR runtime_ms >= 0),
    CONSTRAINT chk_submissions_memory CHECK (memory_kb IS NULL OR memory_kb >= 0),
    CONSTRAINT chk_submissions_timestamps CHECK (
        started_at IS NULL OR started_at >= queued_at
    ),
    CONSTRAINT chk_submissions_completion CHECK (
        completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at
    )
);

CREATE INDEX idx_test_cases_problem_id ON test_cases (problem_id);
CREATE INDEX idx_test_cases_problem_visibility ON test_cases (problem_id, is_visible);
CREATE INDEX idx_submissions_user_id ON submissions (user_id);
CREATE INDEX idx_submissions_problem_id ON submissions (problem_id);
CREATE INDEX idx_submissions_status ON submissions (status);
CREATE INDEX idx_submissions_evaluation_id ON submissions (evaluation_id);
