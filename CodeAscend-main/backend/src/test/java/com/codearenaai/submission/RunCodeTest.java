package com.codearenaai.submission;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import com.codearenaai.submission.dto.CreateRunCodeRequest;
import com.codearenaai.submission.dto.RunCodeResponse;
import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.submission.service.SubmissionService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RunCodeTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Test
    void customInputFiveForFizzBuzzReturnsStdoutAndNotWrongAnswer() {
        String fizzBuzzPythonCode = """
import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

if __name__ == "__main__":
    solve()
""";

        CreateRunCodeRequest request = CreateRunCodeRequest.builder()
                .language(SubmissionLanguage.PYTHON)
                .sourceCode(fizzBuzzPythonCode)
                .customInput("5")
                .problemSlug("fizzbuzz-extended")
                .build();

        long submissionCountBefore = submissionRepository.count();

        RunCodeResponse response = submissionService.runCode(request);

        Assertions.assertEquals(SubmissionStatus.ACCEPTED, response.getStatus(), "Run code status must be ACCEPTED");
        Assertions.assertNull(response.getFailureMessage(), "Failure message must be null on clean execution");
        
        String stdout = response.getStdout() != null ? response.getStdout().replaceAll("\r\n", "\n").trim() : "";
        String expectedStdout = "1\n2\nFizz\n4\nBuzz";
        Assertions.assertEquals(expectedStdout, stdout, "Stdout must match expected FizzBuzz output for n=5");

        long submissionCountAfter = submissionRepository.count();
        Assertions.assertEquals(submissionCountBefore, submissionCountAfter, "Run Code must NOT create an official submission record");
    }

    @Test
    void arbitraryCustomInputWithoutExpectedOutputReturnsStdoutAndAccepted() {
        String echoPythonCode = """
import sys
print("Hello Arbitrary Input: " + sys.stdin.read().strip())
""";

        CreateRunCodeRequest request = CreateRunCodeRequest.builder()
                .language(SubmissionLanguage.PYTHON)
                .sourceCode(echoPythonCode)
                .customInput("TestInput123")
                .build();

        RunCodeResponse response = submissionService.runCode(request);

        Assertions.assertEquals(SubmissionStatus.ACCEPTED, response.getStatus());
        Assertions.assertNull(response.getFailureMessage());
        Assertions.assertEquals("Hello Arbitrary Input: TestInput123", response.getStdout().trim());
    }

    @Test
    void wrongOutputForFizzBuzzReturnsWrongAnswerStatus() {
        String wrongPythonCode = """
import sys
print("Wrong Output Always")
""";

        CreateRunCodeRequest request = CreateRunCodeRequest.builder()
                .language(SubmissionLanguage.PYTHON)
                .sourceCode(wrongPythonCode)
                .customInput("5")
                .problemSlug("fizzbuzz-extended")
                .build();

        RunCodeResponse response = submissionService.runCode(request);

        Assertions.assertEquals(SubmissionStatus.WRONG_ANSWER, response.getStatus(), "Status must be WRONG_ANSWER when output differs");
        Assertions.assertNotNull(response.getExpectedOutput(), "Expected output must be populated from sample test case");
        Assertions.assertEquals("Wrong Output Always", response.getStdout().trim());
    }
}
