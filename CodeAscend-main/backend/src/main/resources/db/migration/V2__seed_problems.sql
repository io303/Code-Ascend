INSERT INTO problems (
    slug,
    title,
    difficulty,
    description,
    input_format,
    output_format,
    constraints,
    sample_input,
    sample_output,
    acceptance_rate,
    time_limit_ms,
    memory_limit_mb
) VALUES
    ('two-sum-sorted', 'Two Sum Sorted', 'EASY', 'Given a sorted array and a target, return the 1-based indices of two numbers whose sum matches the target.', 'The first line contains n and target. The second line contains n sorted integers.', 'Print the two 1-based indices separated by a space.', '2 <= n <= 2 * 10^5. Array values fit in 32-bit signed integers.', '5 9
2 3 4 5 7', '2 4', 78.40, 1000, 256),
    ('palindrome-check', 'Palindrome Check', 'EASY', 'Determine whether the provided string reads the same forward and backward after lowercasing.', 'A single non-empty string s containing only letters.', 'Print true if s is a palindrome, otherwise false.', '1 <= |s| <= 10^5.', 'level', 'true', 83.15, 1000, 256),
    ('max-subarray-lite', 'Maximum Subarray Lite', 'EASY', 'Find the maximum sum of a contiguous subarray.', 'The first line contains n. The second line contains n integers.', 'Print the maximum possible contiguous subarray sum.', '1 <= n <= 2 * 10^5.', '6
-2 1 -3 4 -1 2', '5', 71.05, 1000, 256),
    ('fizzbuzz-extended', 'FizzBuzz Extended', 'EASY', 'Print numbers from 1 to n using Fizz, Buzz, and FizzBuzz rules.', 'A single integer n.', 'Print n lines, one output per number.', '1 <= n <= 10^4.', '5', '1
2
Fizz
4
Buzz', 91.20, 1000, 256),
    ('valid-anagram', 'Valid Anagram', 'EASY', 'Check whether two lowercase strings are anagrams of one another.', 'Two whitespace-separated lowercase strings s and t.', 'Print true if the strings are anagrams, otherwise false.', '1 <= |s|, |t| <= 10^5.', 'listen silent', 'true', 76.55, 1000, 256),
    ('merge-intervals', 'Merge Intervals', 'MEDIUM', 'Merge all overlapping intervals and return the condensed interval list.', 'The first line contains n. Each of the next n lines contains start and end.', 'Print merged intervals in ascending order, one per line.', '1 <= n <= 2 * 10^5.', '4
1 3
2 6
8 10
15 18', '1 6
8 10
15 18', 62.10, 1500, 256),
    ('longest-substring-unique', 'Longest Unique Substring', 'MEDIUM', 'Return the length of the longest substring with all distinct characters.', 'A single string s.', 'Print the maximum length.', '1 <= |s| <= 2 * 10^5.', 'abcabcbb', '3', 59.80, 1500, 256),
    ('spiral-matrix', 'Spiral Matrix', 'MEDIUM', 'Print the elements of a matrix in clockwise spiral order.', 'The first line contains r and c. The next r lines contain c integers.', 'Print the elements in one line separated by spaces.', '1 <= r, c <= 300.', '3 3
1 2 3
4 5 6
7 8 9', '1 2 3 6 9 8 7 4 5', 57.35, 1500, 256),
    ('group-anagrams', 'Group Anagrams', 'MEDIUM', 'Group strings that are anagrams and print each group on a new line.', 'The first line contains n, followed by n lowercase strings.', 'Print grouped strings with groups ordered by first appearance.', '1 <= n <= 10^4.', '6
eat
tea
tan
ate
nat
bat', 'eat tea ate
tan nat
bat', 54.25, 1500, 256),
    ('binary-tree-right-view', 'Binary Tree Right View', 'MEDIUM', 'Given a binary tree in level order with -1 as null, print the right side view.', 'The first line contains n. The second line contains n level-order values.', 'Print the visible node values from top to bottom.', '1 <= n <= 10^5.', '7
1 2 3 -1 5 -1 4', '1 3 4', 51.70, 1500, 256),
    ('word-ladder-ii', 'Word Ladder II', 'HARD', 'Compute the length of the shortest transformation sequence between two words using a dictionary.', 'The first line contains beginWord, endWord, and n. The next n tokens form the dictionary.', 'Print the shortest transformation length, or 0 when unreachable.', 'All words have equal length and contain lowercase letters.', 'hit cog 6
hot dot dog lot log cog', '5', 42.60, 2000, 512),
    ('median-of-stream', 'Median of Stream', 'HARD', 'Maintain the median after each inserted number in a stream.', 'The first line contains n. The second line contains n integers.', 'Print n medians separated by spaces.', '1 <= n <= 2 * 10^5.', '5
5 15 1 3 8', '5 10 5 4 5', 39.90, 2000, 512),
    ('n-queens-count', 'N-Queens Count', 'HARD', 'Count how many valid ways n queens can be placed on an n x n board.', 'A single integer n.', 'Print the total number of valid arrangements.', '1 <= n <= 14.', '4', '2', 36.45, 2000, 512),
    ('largest-rectangle-histogram', 'Largest Rectangle in Histogram', 'HARD', 'Given bar heights, find the largest rectangular area that can be formed.', 'The first line contains n. The second line contains n non-negative integers.', 'Print the maximum rectangle area.', '1 <= n <= 2 * 10^5.', '6
2 1 5 6 2 3', '10', 34.55, 2000, 512),
    ('trapping-rain-water-ii', 'Trapping Rain Water II', 'HARD', 'Compute how much water can be trapped on a 2D elevation map.', 'The first line contains r and c. The next r lines contain c elevations.', 'Print the total trapped water volume.', '1 <= r, c <= 200.', '3 6
1 4 3 1 3 2
3 2 1 3 2 4
2 3 3 2 3 1', '4', 31.85, 2000, 512);

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '5 9
2 3 4 5 7', '2 4', TRUE, 1 FROM problems p WHERE p.slug = 'two-sum-sorted'
UNION ALL SELECT p.id, '4 8
1 2 4 6', '2 4', TRUE, 2 FROM problems p WHERE p.slug = 'two-sum-sorted'
UNION ALL SELECT p.id, '6 11
1 2 3 4 7 9', '2 6', FALSE, 3 FROM problems p WHERE p.slug = 'two-sum-sorted'
UNION ALL SELECT p.id, '7 13
1 2 3 4 5 8 9', '4 7', FALSE, 4 FROM problems p WHERE p.slug = 'two-sum-sorted';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, 'level', 'true', TRUE, 1 FROM problems p WHERE p.slug = 'palindrome-check'
UNION ALL SELECT p.id, 'coding', 'false', TRUE, 2 FROM problems p WHERE p.slug = 'palindrome-check'
UNION ALL SELECT p.id, 'racecar', 'true', FALSE, 3 FROM problems p WHERE p.slug = 'palindrome-check'
UNION ALL SELECT p.id, 'palindrome', 'false', FALSE, 4 FROM problems p WHERE p.slug = 'palindrome-check';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '6
-2 1 -3 4 -1 2', '5', TRUE, 1 FROM problems p WHERE p.slug = 'max-subarray-lite'
UNION ALL SELECT p.id, '5
-8 -3 -6 -2 -5', '-2', TRUE, 2 FROM problems p WHERE p.slug = 'max-subarray-lite'
UNION ALL SELECT p.id, '8
1 -2 3 10 -4 7 2 -5', '18', FALSE, 3 FROM problems p WHERE p.slug = 'max-subarray-lite'
UNION ALL SELECT p.id, '4
4 -1 2 1', '6', FALSE, 4 FROM problems p WHERE p.slug = 'max-subarray-lite';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '5', '1
2
Fizz
4
Buzz', TRUE, 1 FROM problems p WHERE p.slug = 'fizzbuzz-extended'
UNION ALL SELECT p.id, '3', '1
2
Fizz', TRUE, 2 FROM problems p WHERE p.slug = 'fizzbuzz-extended'
UNION ALL SELECT p.id, '15', '1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz', FALSE, 3 FROM problems p WHERE p.slug = 'fizzbuzz-extended'
UNION ALL SELECT p.id, '8', '1
2
Fizz
4
Buzz
Fizz
7
8', FALSE, 4 FROM problems p WHERE p.slug = 'fizzbuzz-extended';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, 'listen silent', 'true', TRUE, 1 FROM problems p WHERE p.slug = 'valid-anagram'
UNION ALL SELECT p.id, 'rat car', 'false', TRUE, 2 FROM problems p WHERE p.slug = 'valid-anagram'
UNION ALL SELECT p.id, 'evil vile', 'true', FALSE, 3 FROM problems p WHERE p.slug = 'valid-anagram'
UNION ALL SELECT p.id, 'dusty studyy', 'false', FALSE, 4 FROM problems p WHERE p.slug = 'valid-anagram';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '4
1 3
2 6
8 10
15 18', '1 6
8 10
15 18', TRUE, 1 FROM problems p WHERE p.slug = 'merge-intervals'
UNION ALL SELECT p.id, '3
1 4
4 5
10 12', '1 5
10 12', TRUE, 2 FROM problems p WHERE p.slug = 'merge-intervals'
UNION ALL SELECT p.id, '5
1 2
2 3
3 4
6 8
7 9', '1 4
6 9', FALSE, 3 FROM problems p WHERE p.slug = 'merge-intervals'
UNION ALL SELECT p.id, '2
5 7
1 3', '1 3
5 7', FALSE, 4 FROM problems p WHERE p.slug = 'merge-intervals';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, 'abcabcbb', '3', TRUE, 1 FROM problems p WHERE p.slug = 'longest-substring-unique'
UNION ALL SELECT p.id, 'bbbbb', '1', TRUE, 2 FROM problems p WHERE p.slug = 'longest-substring-unique'
UNION ALL SELECT p.id, 'pwwkew', '3', FALSE, 3 FROM problems p WHERE p.slug = 'longest-substring-unique'
UNION ALL SELECT p.id, 'dvdf', '3', FALSE, 4 FROM problems p WHERE p.slug = 'longest-substring-unique';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '3 3
1 2 3
4 5 6
7 8 9', '1 2 3 6 9 8 7 4 5', TRUE, 1 FROM problems p WHERE p.slug = 'spiral-matrix'
UNION ALL SELECT p.id, '2 4
1 2 3 4
5 6 7 8', '1 2 3 4 8 7 6 5', TRUE, 2 FROM problems p WHERE p.slug = 'spiral-matrix'
UNION ALL SELECT p.id, '1 5
1 2 3 4 5', '1 2 3 4 5', FALSE, 3 FROM problems p WHERE p.slug = 'spiral-matrix'
UNION ALL SELECT p.id, '4 1
1
2
3
4', '1 2 3 4', FALSE, 4 FROM problems p WHERE p.slug = 'spiral-matrix';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '6
eat
tea
tan
ate
nat
bat', 'eat tea ate
tan nat
bat', TRUE, 1 FROM problems p WHERE p.slug = 'group-anagrams'
UNION ALL SELECT p.id, '4
abc
bca
foo
oof', 'abc bca
foo oof', TRUE, 2 FROM problems p WHERE p.slug = 'group-anagrams'
UNION ALL SELECT p.id, '5
listen
silent
enlist
google
gogole', 'listen silent enlist
google gogole', FALSE, 3 FROM problems p WHERE p.slug = 'group-anagrams'
UNION ALL SELECT p.id, '3
rat
tar
art', 'rat tar art', FALSE, 4 FROM problems p WHERE p.slug = 'group-anagrams';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '7
1 2 3 -1 5 -1 4', '1 3 4', TRUE, 1 FROM problems p WHERE p.slug = 'binary-tree-right-view'
UNION ALL SELECT p.id, '5
1 2 3 4 -1', '1 3 4', TRUE, 2 FROM problems p WHERE p.slug = 'binary-tree-right-view'
UNION ALL SELECT p.id, '1
42', '42', FALSE, 3 FROM problems p WHERE p.slug = 'binary-tree-right-view'
UNION ALL SELECT p.id, '7
10 6 15 3 8 12 20', '10 15 20', FALSE, 4 FROM problems p WHERE p.slug = 'binary-tree-right-view';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, 'hit cog 6
hot dot dog lot log cog', '5', TRUE, 1 FROM problems p WHERE p.slug = 'word-ladder-ii'
UNION ALL SELECT p.id, 'hit zip 5
hot dot dog lot log', '0', TRUE, 2 FROM problems p WHERE p.slug = 'word-ladder-ii'
UNION ALL SELECT p.id, 'lost cost 6
most fist lost cost fish host', '2', FALSE, 3 FROM problems p WHERE p.slug = 'word-ladder-ii'
UNION ALL SELECT p.id, 'game math 7
fame fate mate math gate gath game', '5', FALSE, 4 FROM problems p WHERE p.slug = 'word-ladder-ii';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '5
5 15 1 3 8', '5 10 5 4 5', TRUE, 1 FROM problems p WHERE p.slug = 'median-of-stream'
UNION ALL SELECT p.id, '4
2 4 6 8', '2 3 4 5', TRUE, 2 FROM problems p WHERE p.slug = 'median-of-stream'
UNION ALL SELECT p.id, '3
1 2 3', '1 1.5 2', FALSE, 3 FROM problems p WHERE p.slug = 'median-of-stream'
UNION ALL SELECT p.id, '6
10 20 30 40 50 60', '10 15 20 25 30 35', FALSE, 4 FROM problems p WHERE p.slug = 'median-of-stream';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '4', '2', TRUE, 1 FROM problems p WHERE p.slug = 'n-queens-count'
UNION ALL SELECT p.id, '1', '1', TRUE, 2 FROM problems p WHERE p.slug = 'n-queens-count'
UNION ALL SELECT p.id, '5', '10', FALSE, 3 FROM problems p WHERE p.slug = 'n-queens-count'
UNION ALL SELECT p.id, '6', '4', FALSE, 4 FROM problems p WHERE p.slug = 'n-queens-count';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '6
2 1 5 6 2 3', '10', TRUE, 1 FROM problems p WHERE p.slug = 'largest-rectangle-histogram'
UNION ALL SELECT p.id, '4
2 4 2 1', '6', TRUE, 2 FROM problems p WHERE p.slug = 'largest-rectangle-histogram'
UNION ALL SELECT p.id, '5
1 1 1 1 1', '5', FALSE, 3 FROM problems p WHERE p.slug = 'largest-rectangle-histogram'
UNION ALL SELECT p.id, '7
6 2 5 4 5 1 6', '12', FALSE, 4 FROM problems p WHERE p.slug = 'largest-rectangle-histogram';

INSERT INTO test_cases (problem_id, input_data, expected_output, is_visible, display_order)
SELECT p.id, '3 6
1 4 3 1 3 2
3 2 1 3 2 4
2 3 3 2 3 1', '4', TRUE, 1 FROM problems p WHERE p.slug = 'trapping-rain-water-ii'
UNION ALL SELECT p.id, '3 3
3 3 3
3 1 3
3 3 3', '2', TRUE, 2 FROM problems p WHERE p.slug = 'trapping-rain-water-ii'
UNION ALL SELECT p.id, '4 4
5 5 5 5
5 1 1 5
5 1 5 5
5 2 5 8', '3', FALSE, 3 FROM problems p WHERE p.slug = 'trapping-rain-water-ii'
UNION ALL SELECT p.id, '5 4
12 13 1 12
13 4 13 12
13 8 10 12
12 13 12 12
13 13 13 13', '14', FALSE, 4 FROM problems p WHERE p.slug = 'trapping-rain-water-ii';

UPDATE problems p
SET examples_json = (
    SELECT jsonb_agg(
        jsonb_build_object(
            'input', tc.input_data,
            'output', tc.expected_output
        )
        ORDER BY tc.display_order
    )
    FROM test_cases tc
    WHERE tc.problem_id = p.id
      AND tc.is_visible = TRUE
);
