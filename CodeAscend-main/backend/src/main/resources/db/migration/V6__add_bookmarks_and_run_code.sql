CREATE TABLE problem_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_problem_bookmark UNIQUE (user_id, problem_id)
);

CREATE INDEX idx_problem_bookmarks_user_id ON problem_bookmarks (user_id);
