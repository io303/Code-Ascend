package com.codearenaai.submission;

import static org.junit.jupiter.api.Assertions.*;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.TestCase;
import com.codearenaai.problem.repository.ProblemRepository;
import com.codearenaai.submission.eval.CodeExecutionEvaluator;
import com.codearenaai.submission.eval.EvaluationResult;
import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.model.SubmissionStatus;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
class BinaryTreeRightViewTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private CodeExecutionEvaluator evaluator;

    @Test
    @Transactional
    void testBinaryTreeRightView_WithKnownCorrectCppSolution() {
        Problem problem = problemRepository.findBySlug("binary-tree-right-view").orElseThrow();
        List<TestCase> testCases = problem.getTestCases();

        String cppSolution = """
            #include <iostream>
            #include <vector>
            #include <queue>
            using namespace std;

            struct TreeNode {
                int val;
                TreeNode* left;
                TreeNode* right;
                TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
            };

            int main() {
                ios_base::sync_with_stdio(false);
                cin.tie(NULL);
                int n;
                if (!(cin >> n) || n <= 0) return 0;
                vector<int> arr(n);
                for (int i = 0; i < n; i++) {
                    cin >> arr[i];
                }
                if (arr[0] == -1) return 0;

                TreeNode* root = new TreeNode(arr[0]);
                queue<TreeNode*> q;
                q.push(root);
                int i = 1;
                while (!q.empty() && i < n) {
                    TreeNode* curr = q.front();
                    q.pop();

                    if (i < n) {
                        if (arr[i] != -1) {
                            curr->left = new TreeNode(arr[i]);
                            q.push(curr->left);
                        }
                        i++;
                    }
                    if (i < n) {
                        if (arr[i] != -1) {
                            curr->right = new TreeNode(arr[i]);
                            q.push(curr->right);
                        }
                        i++;
                    }
                }

                queue<TreeNode*> lq;
                lq.push(root);
                vector<int> result;
                while (!lq.empty()) {
                    int sz = lq.size();
                    for (int k = 0; k < sz; k++) {
                        TreeNode* node = lq.front();
                        lq.pop();
                        if (k == sz - 1) {
                            result.push_back(node->val);
                        }
                        if (node->left) lq.push(node->left);
                        if (node->right) lq.push(node->right);
                    }
                }

                for (size_t k = 0; k < result.size(); k++) {
                    cout << result[k] << (k == result.size() - 1 ? "" : " ");
                }
                cout << "\\n";
                return 0;
            }
            """;

        System.out.println("=== TESTING EACH TEST CASE INDIVIDUALLY ===");
        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            EvaluationResult singleResult = evaluator.evaluate(
                    cppSolution,
                    SubmissionLanguage.CPP,
                    Collections.singletonList(tc),
                    problem.getTimeLimitMs(),
                    problem.getMemoryLimitMb()
            );

            System.out.println("TC " + (i + 1) + " (visible=" + tc.isVisible() + "):");
            System.out.println("  Input Stdin: [" + tc.getInputData().replace("\n", "\\n") + "]");
            System.out.println("  Expected Output: [" + tc.getExpectedOutput().replace("\n", "\\n") + "]");
            System.out.println("  Status: " + singleResult.getStatus());
            System.out.println("  Failure Message: " + singleResult.getFailureMessage());
        }

        EvaluationResult fullResult = evaluator.evaluate(
                cppSolution,
                SubmissionLanguage.CPP,
                testCases,
                problem.getTimeLimitMs(),
                problem.getMemoryLimitMb()
        );

        assertEquals(SubmissionStatus.ACCEPTED, fullResult.getStatus(), "Known-correct C++ solution should be ACCEPTED");
    }
}
