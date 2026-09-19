package com.codearenaai.submission;

import static org.junit.jupiter.api.Assertions.*;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.repository.ProblemRepository;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.submission.service.StaleSubmissionRecoveryService;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class StaleSubmissionRecoveryTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private StaleSubmissionRecoveryService recoveryService;

    private User testUser;
    private Problem testProblem;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findAll().stream().findFirst().orElseGet(() -> {
            User u = new User();
            u.setUsername("recovery_user_" + System.currentTimeMillis());
            u.setEmail("recovery_" + System.currentTimeMillis() + "@codearena.ai");
            u.setDisplayName("Recovery Test User");
            u.setPasswordHash("hash");
            return userRepository.save(u);
        });

        testProblem = problemRepository.findAll().stream().findFirst().orElseThrow();
    }

    @Test
    void recoverStaleSubmissions_ShouldMarkStalePendingAndRunningSubmissionsAsFailed() {
        Instant tenMinsAgo = Instant.now().minus(10, ChronoUnit.MINUTES);

        // Given: a submission stuck in PENDING from 10 minutes ago
        Submission stalePending = new Submission();
        stalePending.setUser(testUser);
        stalePending.setProblem(testProblem);
        stalePending.setLanguage(SubmissionLanguage.PYTHON);
        stalePending.setSourceCode("print('stale pending')");
        stalePending.setStatus(SubmissionStatus.PENDING);
        stalePending.setQueuedAt(tenMinsAgo);
        stalePending.setSubmittedAt(tenMinsAgo);
        stalePending = submissionRepository.saveAndFlush(stalePending);

        // Given: a submission stuck in RUNNING from 10 minutes ago
        Submission staleRunning = new Submission();
        staleRunning.setUser(testUser);
        staleRunning.setProblem(testProblem);
        staleRunning.setLanguage(SubmissionLanguage.PYTHON);
        staleRunning.setSourceCode("print('stale running')");
        staleRunning.setStatus(SubmissionStatus.RUNNING);
        staleRunning.setQueuedAt(tenMinsAgo);
        staleRunning.setStartedAt(tenMinsAgo);
        staleRunning.setSubmittedAt(tenMinsAgo);
        staleRunning = submissionRepository.saveAndFlush(staleRunning);

        // When: recovery runs
        int recovered = recoveryService.recoverStaleSubmissions();

        // Then: both stale submissions are marked as RUNTIME_ERROR (failure)
        assertTrue(recovered >= 2);

        Submission recoveredPending = submissionRepository.findById(stalePending.getId()).orElseThrow();
        assertEquals(SubmissionStatus.RUNTIME_ERROR, recoveredPending.getStatus());
        assertNotNull(recoveredPending.getFailureMessage());
        assertTrue(recoveredPending.getFailureMessage().contains("timed out or was interrupted"));
        assertNotNull(recoveredPending.getCompletedAt());

        Submission recoveredRunning = submissionRepository.findById(staleRunning.getId()).orElseThrow();
        assertEquals(SubmissionStatus.RUNTIME_ERROR, recoveredRunning.getStatus());
        assertNotNull(recoveredRunning.getFailureMessage());
        assertTrue(recoveredRunning.getFailureMessage().contains("timed out or was interrupted"));
        assertNotNull(recoveredRunning.getCompletedAt());
    }

    @Test
    void recoverStaleSubmissions_ShouldNotModifyRecentPendingSubmissions() {
        Instant oneMinAgo = Instant.now().minus(1, ChronoUnit.MINUTES);

        // Given: a recent pending submission from 1 minute ago
        Submission recentPending = new Submission();
        recentPending.setUser(testUser);
        recentPending.setProblem(testProblem);
        recentPending.setLanguage(SubmissionLanguage.PYTHON);
        recentPending.setSourceCode("print('recent pending')");
        recentPending.setStatus(SubmissionStatus.PENDING);
        recentPending.setQueuedAt(oneMinAgo);
        recentPending.setSubmittedAt(oneMinAgo);
        recentPending = submissionRepository.saveAndFlush(recentPending);

        // When: recovery runs
        recoveryService.recoverStaleSubmissions();

        // Then: recent submission remains PENDING
        Submission fetched = submissionRepository.findById(recentPending.getId()).orElseThrow();
        assertEquals(SubmissionStatus.PENDING, fetched.getStatus());
        assertNull(fetched.getFailureMessage());
    }

    @Test
    void recoverStaleSubmissions_ShouldNotModifyCompletedSubmissions() {
        Instant tenMinsAgo = Instant.now().minus(10, ChronoUnit.MINUTES);

        // Given: an accepted submission from 10 minutes ago
        Submission completed = new Submission();
        completed.setUser(testUser);
        completed.setProblem(testProblem);
        completed.setLanguage(SubmissionLanguage.PYTHON);
        completed.setSourceCode("print('accepted')");
        completed.setStatus(SubmissionStatus.ACCEPTED);
        completed.setQueuedAt(tenMinsAgo);
        completed.setStartedAt(tenMinsAgo);
        completed.setSubmittedAt(tenMinsAgo);
        completed.setCompletedAt(tenMinsAgo);
        completed = submissionRepository.saveAndFlush(completed);

        // When: recovery runs
        recoveryService.recoverStaleSubmissions();

        // Then: completed submission remains ACCEPTED
        Submission fetched = submissionRepository.findById(completed.getId()).orElseThrow();
        assertEquals(SubmissionStatus.ACCEPTED, fetched.getStatus());
    }
}
