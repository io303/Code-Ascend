package com.codearenaai.submission.service;

import com.codearenaai.ai.service.AIAgentService;
import com.codearenaai.leaderboard.service.LeaderboardService;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.TestCase;
import com.codearenaai.rating.service.RatingService;
import com.codearenaai.submission.eval.CodeExecutionEvaluator;
import com.codearenaai.submission.eval.EvaluationResult;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final CodeExecutionEvaluator codeExecutionEvaluator;
    private final LeaderboardService leaderboardService;
    private final AIAgentService aiAgentService;
    private final RatingService ratingService;

    @Transactional
    public void evaluateSubmission(UUID submissionId) {
        Submission submission = null;

        // Defensive retry to ensure database transaction commit is visible across threads
        for (int i = 0; i < 5; i++) {
            submission = submissionRepository.findByIdWithDetails(submissionId).orElse(null);
            if (submission != null) {
                break;
            }
            try {
                Thread.sleep(100);
            } catch (InterruptedException ignored) {
                Thread.currentThread().interrupt();
            }
        }

        if (submission == null) {
            log.warn("Submission not found for evaluation after retries: {}", submissionId);
            return;
        }

        if (submission.getStatus() != SubmissionStatus.PENDING) {
            log.info("Submission {} already processed with status {}", submissionId, submission.getStatus());
            return;
        }

        // Transition PENDING -> RUNNING
        submission.setStatus(SubmissionStatus.RUNNING);
        submission.setStartedAt(Instant.now());
        submission = submissionRepository.saveAndFlush(submission);

        Problem problem = submission.getProblem();
        User user = submission.getUser();

        try {
            List<TestCase> testCases = problem.getTestCases();
            EvaluationResult evalResult = codeExecutionEvaluator.evaluate(
                    submission.getSourceCode(),
                    submission.getLanguage(),
                    testCases,
                    problem.getTimeLimitMs(),
                    problem.getMemoryLimitMb()
            );

            submission.setStatus(evalResult.getStatus());
            submission.setRuntimeMs(evalResult.getRuntimeMs());
            submission.setMemoryKb(evalResult.getMemoryKb());
            submission.setFailureMessage(evalResult.getFailureMessage());
            submission.setCompletedAt(Instant.now());

            // Process Elo Rating calculation & history event
            if (evalResult.getStatus() == SubmissionStatus.ACCEPTED && user != null && problem != null) {
                try {
                    ratingService.processAcceptedSolve(user, problem, submission);
                } catch (Exception e) {
                    log.warn("Rating update warning for submission {}: {}", submissionId, e.getMessage());
                }
            }

            // Defensive AI Agents execution
            runAiAgents(submission, problem, user);

        } catch (Exception e) {
            log.error("Error evaluating submission {}", submissionId, e);
            submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
            submission.setFailureMessage("System evaluation error: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()));
            submission.setCompletedAt(Instant.now());
        }

        submissionRepository.saveAndFlush(submission);
        log.info("Finished evaluating submissionId={} with final status={}", submissionId, submission.getStatus());
    }

    private void runAiAgents(Submission submission, Problem problem, User user) {
        try {
            String complexityJson = aiAgentService.analyzeComplexity(
                    problem.getTitle(),
                    submission.getSourceCode(),
                    submission.getLanguage().name()
            );
            submission.setAiComplexityJson(complexityJson);

            List<String> prevSubmissions = submissionRepository.findAllByProblemIdOrderBySubmittedAtDesc(problem.getId()).stream()
                    .filter(s -> !s.getId().equals(submission.getId()))
                    .map(Submission::getSourceCode)
                    .limit(10)
                    .toList();
            int plagiarismScore = aiAgentService.checkPlagiarism(submission.getSourceCode(), prevSubmissions);
            submission.setAiPlagiarismScore(plagiarismScore);

            String feedback = aiAgentService.evaluateCodeQuality(
                    problem.getTitle(),
                    submission.getSourceCode(),
                    submission.getLanguage().name(),
                    submission.getStatus().name()
            );
            submission.setAiFeedback(feedback);

        } catch (Exception e) {
            log.warn("AI Agent execution failed gracefully: {}", e.getMessage());
        }
    }
}
