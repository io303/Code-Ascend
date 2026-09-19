CREATE TABLE problem_tags (
    problem_id UUID NOT NULL REFERENCES problems (id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (problem_id, tag)
);

CREATE INDEX idx_problem_tags_tag ON problem_tags (tag);

-- Seed tags for problems
INSERT INTO problem_tags (problem_id, tag)
SELECT id, 'Two Pointers' FROM problems WHERE slug = 'two-sum-sorted'
UNION ALL SELECT id, 'Arrays' FROM problems WHERE slug = 'two-sum-sorted'
UNION ALL SELECT id, 'Strings' FROM problems WHERE slug = 'palindrome-check'
UNION ALL SELECT id, 'Two Pointers' FROM problems WHERE slug = 'palindrome-check'
UNION ALL SELECT id, 'Dynamic Programming' FROM problems WHERE slug = 'max-subarray-lite'
UNION ALL SELECT id, 'Arrays' FROM problems WHERE slug = 'max-subarray-lite'
UNION ALL SELECT id, 'Math' FROM problems WHERE slug = 'fizzbuzz-extended'
UNION ALL SELECT id, 'Strings' FROM problems WHERE slug = 'fizzbuzz-extended'
UNION ALL SELECT id, 'Hash Table' FROM problems WHERE slug = 'valid-anagram'
UNION ALL SELECT id, 'Strings' FROM problems WHERE slug = 'valid-anagram'
UNION ALL SELECT id, 'Intervals' FROM problems WHERE slug = 'merge-intervals'
UNION ALL SELECT id, 'Sorting' FROM problems WHERE slug = 'merge-intervals'
UNION ALL SELECT id, 'Sliding Window' FROM problems WHERE slug = 'longest-substring-unique'
UNION ALL SELECT id, 'Hash Table' FROM problems WHERE slug = 'longest-substring-unique'
UNION ALL SELECT id, 'Matrix' FROM problems WHERE slug = 'spiral-matrix'
UNION ALL SELECT id, 'Arrays' FROM problems WHERE slug = 'spiral-matrix'
UNION ALL SELECT id, 'Hash Table' FROM problems WHERE slug = 'group-anagrams'
UNION ALL SELECT id, 'Strings' FROM problems WHERE slug = 'group-anagrams'
UNION ALL SELECT id, 'Trees' FROM problems WHERE slug = 'binary-tree-right-view'
UNION ALL SELECT id, 'BFS' FROM problems WHERE slug = 'binary-tree-right-view'
UNION ALL SELECT id, 'Graphs' FROM problems WHERE slug = 'word-ladder-ii'
UNION ALL SELECT id, 'BFS' FROM problems WHERE slug = 'word-ladder-ii'
UNION ALL SELECT id, 'Heaps' FROM problems WHERE slug = 'median-of-stream'
UNION ALL SELECT id, 'Data Structures' FROM problems WHERE slug = 'median-of-stream'
UNION ALL SELECT id, 'Backtracking' FROM problems WHERE slug = 'n-queens-count'
UNION ALL SELECT id, 'Recursion' FROM problems WHERE slug = 'n-queens-count'
UNION ALL SELECT id, 'Stack' FROM problems WHERE slug = 'largest-rectangle-histogram'
UNION ALL SELECT id, 'Arrays' FROM problems WHERE slug = 'largest-rectangle-histogram'
UNION ALL SELECT id, 'Heaps' FROM problems WHERE slug = 'trapping-rain-water-ii'
UNION ALL SELECT id, 'Matrix' FROM problems WHERE slug = 'trapping-rain-water-ii';

-- Add AI fields to submissions
ALTER TABLE submissions
    ADD COLUMN ai_hint TEXT,
    ADD COLUMN ai_complexity_json TEXT,
    ADD COLUMN ai_plagiarism_score INTEGER,
    ADD COLUMN ai_feedback TEXT;
