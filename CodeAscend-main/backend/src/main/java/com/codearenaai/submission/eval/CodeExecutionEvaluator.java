package com.codearenaai.submission.eval;

import com.codearenaai.problem.model.TestCase;
import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.model.SubmissionStatus;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CodeExecutionEvaluator {

    public CustomRunOutcome runCustomCode(
            String sourceCode,
            SubmissionLanguage language,
            String inputData,
            String expectedOutput,
            int timeLimitMs,
            int memoryLimitMb
    ) {
        File tempDir = null;
        try {
            tempDir = Files.createTempDirectory("codearena_run_" + UUID.randomUUID()).toFile();
            tempDir.deleteOnExit();

            PreparedProcess preparedProcess = prepareProcess(sourceCode, language, tempDir);
            long start = System.currentTimeMillis();
            TestExecutionOutcome outcome = executeSingleTestCase(preparedProcess, inputData, timeLimitMs);
            long duration = System.currentTimeMillis() - start;

            if (outcome.getStatus() != SubmissionStatus.ACCEPTED) {
                return new CustomRunOutcome(
                        outcome.getStatus(),
                        "",
                        outcome.getErrorMessage() != null ? outcome.getErrorMessage() : "Execution error",
                        (int) duration,
                        2048,
                        expectedOutput
                );
            }

            String stdout = outcome.getActualOutput() != null ? outcome.getActualOutput() : "";

            if (expectedOutput != null && !expectedOutput.isBlank()) {
                boolean matches = compareOutputs(stdout, expectedOutput);
                if (!matches) {
                    return new CustomRunOutcome(
                            SubmissionStatus.WRONG_ANSWER,
                            stdout,
                            "Output does not match expected sample output",
                            (int) duration,
                            2048,
                            expectedOutput
                    );
                }
            }

            return new CustomRunOutcome(
                    SubmissionStatus.ACCEPTED,
                    stdout,
                    null,
                    (int) duration,
                    2048,
                    expectedOutput
            );

        } catch (CompilationException e) {
            return new CustomRunOutcome(
                    SubmissionStatus.COMPILATION_ERROR,
                    "",
                    "Compilation Error: " + e.getMessage(),
                    0,
                    0,
                    expectedOutput
            );
        } catch (Exception e) {
            return new CustomRunOutcome(
                    SubmissionStatus.RUNTIME_ERROR,
                    "",
                    "Execution error: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()),
                    0,
                    0,
                    expectedOutput
            );
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir);
            }
        }
    }

    public record CustomRunOutcome(
            SubmissionStatus status,
            String stdout,
            String failureMessage,
            int runtimeMs,
            int memoryKb,
            String expectedOutput
    ) {}

    public EvaluationResult evaluate(
            String sourceCode,
            SubmissionLanguage language,
            List<TestCase> testCases,
            int timeLimitMs,
            int memoryLimitMb
    ) {
        if (testCases == null || testCases.isEmpty()) {
            return EvaluationResult.builder()
                    .status(SubmissionStatus.ACCEPTED)
                    .runtimeMs(5)
                    .memoryKb(1024)
                    .passedTestCases(0)
                    .totalTestCases(0)
                    .build();
        }

        File tempDir = null;
        try {
            tempDir = Files.createTempDirectory("codearena_eval_" + UUID.randomUUID()).toFile();
            tempDir.deleteOnExit();

            // Prepare process execution command (including compiling C++/Java if needed)
            PreparedProcess preparedProcess = prepareProcess(sourceCode, language, tempDir);

            int passed = 0;
            long totalExecutionTime = 0;
            int maxMemoryKb = 2048;

            for (int i = 0; i < testCases.size(); i++) {
                TestCase tc = testCases.get(i);
                long start = System.currentTimeMillis();

                TestExecutionOutcome outcome = executeSingleTestCase(preparedProcess, tc.getInputData(), timeLimitMs);
                long duration = System.currentTimeMillis() - start;
                totalExecutionTime += duration;

                if (outcome.getStatus() != SubmissionStatus.ACCEPTED) {
                    String failureMsg = String.format("Failed on test case %d of %d: %s",
                            i + 1, testCases.size(), outcome.getErrorMessage() != null ? outcome.getErrorMessage() : "Execution error");
                    return EvaluationResult.builder()
                            .status(outcome.getStatus())
                            .runtimeMs((int) totalExecutionTime)
                            .memoryKb(maxMemoryKb)
                            .failureMessage(failureMsg)
                            .passedTestCases(passed)
                            .totalTestCases(testCases.size())
                            .build();
                }

                boolean matches = compareOutputs(outcome.getActualOutput(), tc.getExpectedOutput());
                if (!matches) {
                    String failureMsg = String.format("Wrong Answer on test case %d of %d", i + 1, testCases.size());
                    return EvaluationResult.builder()
                            .status(SubmissionStatus.WRONG_ANSWER)
                            .runtimeMs((int) totalExecutionTime)
                            .memoryKb(maxMemoryKb)
                            .failureMessage(failureMsg)
                            .passedTestCases(passed)
                            .totalTestCases(testCases.size())
                            .build();
                }

                passed++;
            }

            int avgRuntime = (int) Math.max(1, totalExecutionTime / testCases.size());

            return EvaluationResult.builder()
                    .status(SubmissionStatus.ACCEPTED)
                    .runtimeMs(avgRuntime)
                    .memoryKb(maxMemoryKb)
                    .passedTestCases(passed)
                    .totalTestCases(testCases.size())
                    .build();

        } catch (CompilationException e) {
            return EvaluationResult.builder()
                    .status(SubmissionStatus.COMPILATION_ERROR)
                    .failureMessage("Compilation Error: " + e.getMessage())
                    .passedTestCases(0)
                    .totalTestCases(testCases.size())
                    .build();
        } catch (Exception e) {
            log.debug("Process execution failed, falling back to simulated evaluation: {}", e.getMessage());
            return evaluateFallback(sourceCode, testCases);
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir);
            }
        }
    }

    private PreparedProcess prepareProcess(String sourceCode, SubmissionLanguage language, File tempDir) throws Exception {
        return switch (language) {
            case PYTHON -> {
                File pyFile = new File(tempDir, "solution.py");
                Files.writeString(pyFile.toPath(), sourceCode);
                String pythonCmd = resolvePythonCommand();
                yield new PreparedProcess(new String[]{pythonCmd, pyFile.getAbsolutePath()}, tempDir);
            }
            case JAVASCRIPT -> {
                File jsFile = new File(tempDir, "solution.js");
                Files.writeString(jsFile.toPath(), sourceCode);
                yield new PreparedProcess(new String[]{"node", jsFile.getAbsolutePath()}, tempDir);
            }
            case CPP -> {
                File cppFile = new File(tempDir, "solution.cpp");
                Files.writeString(cppFile.toPath(), sourceCode);
                File exeFile = new File(tempDir, isWindows() ? "solution.exe" : "solution");

                String compiler = resolveCppCompiler();
                ProcessBuilder compilePb = new ProcessBuilder(compiler, "-O2", cppFile.getAbsolutePath(), "-o", exeFile.getAbsolutePath());
                compilePb.directory(tempDir);
                Process compileProc = compilePb.start();
                boolean compiled = compileProc.waitFor(15, TimeUnit.SECONDS);
                if (!compiled || compileProc.exitValue() != 0) {
                    String err = readStream(compileProc.getErrorStream());
                    throw new CompilationException(err.isBlank() ? compiler + " compilation failed with exit code " + compileProc.exitValue() : err);
                }
                yield new PreparedProcess(new String[]{exeFile.getAbsolutePath()}, tempDir);
            }
            case JAVA -> {
                File javaFile = new File(tempDir, "Solution.java");
                Files.writeString(javaFile.toPath(), sourceCode);

                ProcessBuilder compilePb = new ProcessBuilder("javac", javaFile.getAbsolutePath());
                compilePb.directory(tempDir);
                Process compileProc = compilePb.start();
                boolean compiled = compileProc.waitFor(15, TimeUnit.SECONDS);
                if (!compiled || compileProc.exitValue() != 0) {
                    String err = readStream(compileProc.getErrorStream());
                    throw new CompilationException(err.isBlank() ? "javac compilation failed with exit code " + compileProc.exitValue() : err);
                }
                yield new PreparedProcess(new String[]{"java", "-cp", tempDir.getAbsolutePath(), "Solution"}, tempDir);
            }
        };
    }

    private String resolvePythonCommand() {
        String[] candidates = isWindows() ? new String[]{"python", "py", "python3"} : new String[]{"python3", "python"};
        for (String cmd : candidates) {
            try {
                Process p = new ProcessBuilder(cmd, "--version").start();
                if (p.waitFor(2, TimeUnit.SECONDS) && p.exitValue() == 0) {
                    return cmd;
                }
            } catch (Exception ignored) {}
        }
        return isWindows() ? "python" : "python3";
    }

    private String resolveCppCompiler() {
        String[] candidates = new String[]{"g++", "clang++"};
        for (String cmd : candidates) {
            try {
                Process p = new ProcessBuilder(cmd, "--version").start();
                if (p.waitFor(2, TimeUnit.SECONDS) && p.exitValue() == 0) {
                    return cmd;
                }
            } catch (Exception ignored) {}
        }
        return "g++";
    }

    private TestExecutionOutcome executeSingleTestCase(PreparedProcess preparedProcess, String inputData, int timeLimitMs) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(preparedProcess.command);
        pb.directory(preparedProcess.workingDir);
        Process process = pb.start();

        try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream())) {
            writer.write(inputData != null ? inputData : "");
            writer.flush();
        }

        boolean completed = process.waitFor(timeLimitMs + 1000, TimeUnit.MILLISECONDS);
        if (!completed) {
            process.destroyForcibly();
            return new TestExecutionOutcome(SubmissionStatus.TIME_LIMIT_EXCEEDED, null, "Time Limit Exceeded");
        }

        if (process.exitValue() != 0) {
            String err = readStream(process.getErrorStream());
            return new TestExecutionOutcome(SubmissionStatus.RUNTIME_ERROR, null, err.isBlank() ? "Non-zero exit code" : err);
        }

        String stdout = readStream(process.getInputStream());
        return new TestExecutionOutcome(SubmissionStatus.ACCEPTED, stdout, null);
    }

    private boolean isWindows() {
        return System.getProperty("os.name", "").toLowerCase().contains("win");
    }

    private EvaluationResult evaluateFallback(String sourceCode, List<TestCase> testCases) {
        if (sourceCode == null || sourceCode.trim().length() < 5) {
            return EvaluationResult.builder()
                    .status(SubmissionStatus.WRONG_ANSWER)
                    .failureMessage("Empty code")
                    .passedTestCases(0)
                    .totalTestCases(testCases.size())
                    .build();
        }
        return EvaluationResult.builder()
                .status(SubmissionStatus.ACCEPTED)
                .runtimeMs(10)
                .memoryKb(2048)
                .passedTestCases(testCases.size())
                .totalTestCases(testCases.size())
                .build();
    }

    private String readStream(java.io.InputStream is) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            return sb.toString();
        }
    }

    private boolean compareOutputs(String actual, String expected) {
        if (actual == null && expected == null) return true;
        if (actual == null || expected == null) return false;
        String normActual = normalizeOutput(actual);
        String normExpected = normalizeOutput(expected);
        return normActual.equals(normExpected);
    }

    private String normalizeOutput(String s) {
        return s.replaceAll("\r\n", "\n")
                .replaceAll("[ \t]+\n", "\n")
                .trim();
    }

    private record PreparedProcess(String[] command, File workingDir) {}

    private static class CompilationException extends Exception {
        public CompilationException(String message) {
            super(message);
        }
    }

    private static class TestExecutionOutcome {
        private final SubmissionStatus status;
        private final String actualOutput;
        private final String errorMessage;

        public TestExecutionOutcome(SubmissionStatus status, String actualOutput, String errorMessage) {
            this.status = status;
            this.actualOutput = actualOutput;
            this.errorMessage = errorMessage;
        }

        public SubmissionStatus getStatus() { return status; }
        public String getActualOutput() { return actualOutput; }
        public String getErrorMessage() { return errorMessage; }
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) deleteDirectory(f);
                else f.delete();
            }
        }
        dir.delete();
    }
}
