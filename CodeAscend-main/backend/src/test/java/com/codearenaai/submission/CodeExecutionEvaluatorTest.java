package com.codearenaai.submission;

import static org.junit.jupiter.api.Assertions.*;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import com.codearenaai.problem.model.TestCase;
import com.codearenaai.submission.eval.CodeExecutionEvaluator;
import com.codearenaai.submission.eval.EvaluationResult;
import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.model.SubmissionStatus;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CodeExecutionEvaluatorTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private CodeExecutionEvaluator evaluator;

    private TestCase createTestCase(String input, String expected) {
        TestCase tc = new TestCase();
        tc.setInputData(input);
        tc.setExpectedOutput(expected);
        tc.setVisible(true);
        tc.setDisplayOrder(1);
        return tc;
    }

    @Test
    void evaluateCpp_CorrectSolution_ShouldBeAccepted() {
        String cppCode = """
            #include <iostream>
            using namespace std;
            int main() {
                int a, b;
                if (cin >> a >> b) {
                    cout << (a + b) << endl;
                }
                return 0;
            }
            """;
        List<TestCase> testCases = List.of(createTestCase("3 4", "7"));

        EvaluationResult result = evaluator.evaluate(cppCode, SubmissionLanguage.CPP, testCases, 2000, 256);
        assertEquals(SubmissionStatus.ACCEPTED, result.getStatus());
        assertEquals(1, result.getPassedTestCases());
    }

    @Test
    void evaluateCpp_CompilationError_ShouldReturnCompilationError() {
        String invalidCppCode = "int main() { invalid_syntax }";
        List<TestCase> testCases = List.of(createTestCase("1", "1"));

        EvaluationResult result = evaluator.evaluate(invalidCppCode, SubmissionLanguage.CPP, testCases, 2000, 256);
        assertEquals(SubmissionStatus.COMPILATION_ERROR, result.getStatus());
        assertNotNull(result.getFailureMessage());
        assertTrue(result.getFailureMessage().contains("Compilation Error"));
    }

    @Test
    void evaluatePython_CorrectSolution_ShouldBeAccepted() {
        String pyCode = """
            import sys
            nums = sys.stdin.read().split()
            if nums:
                print(int(nums[0]) + int(nums[1]))
            """;
        List<TestCase> testCases = List.of(createTestCase("10 20", "30"));

        EvaluationResult result = evaluator.evaluate(pyCode, SubmissionLanguage.PYTHON, testCases, 2000, 256);
        assertEquals(SubmissionStatus.ACCEPTED, result.getStatus());
    }

    @Test
    void evaluateJava_CorrectSolution_ShouldBeAccepted() {
        String javaCode = """
            import java.util.Scanner;
            public class Solution {
                public static void main(String[] args) {
                    Scanner sc = new Scanner(System.in);
                    if (sc.hasNextInt()) {
                        int a = sc.nextInt();
                        int b = sc.nextInt();
                        System.out.println(a * b);
                    }
                }
            }
            """;
        List<TestCase> testCases = List.of(createTestCase("6 7", "42"));

        EvaluationResult result = evaluator.evaluate(javaCode, SubmissionLanguage.JAVA, testCases, 3000, 256);
        assertEquals(SubmissionStatus.ACCEPTED, result.getStatus());
    }

    @Test
    void evaluateJavaScript_CorrectSolution_ShouldBeAccepted() {
        String jsCode = """
            const fs = require('fs');
            const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
            if (input.length >= 2) {
                console.log(parseInt(input[0]) + parseInt(input[1]));
            }
            """;
        List<TestCase> testCases = List.of(createTestCase("15 25", "40"));

        EvaluationResult result = evaluator.evaluate(jsCode, SubmissionLanguage.JAVASCRIPT, testCases, 2000, 256);
        assertEquals(SubmissionStatus.ACCEPTED, result.getStatus());
    }

    @Test
    void evaluate_TimeLimitExceeded_ShouldReturnTle() {
        String pyInfiniteLoop = "while True: pass";
        List<TestCase> testCases = List.of(createTestCase("1", "1"));

        EvaluationResult result = evaluator.evaluate(pyInfiniteLoop, SubmissionLanguage.PYTHON, testCases, 500, 256);
        assertEquals(SubmissionStatus.TIME_LIMIT_EXCEEDED, result.getStatus());
        assertTrue(result.getFailureMessage().contains("Time Limit Exceeded"));
    }
}
