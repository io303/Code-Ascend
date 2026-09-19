package com.codearenaai.submission.service;

import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class StaleSubmissionRecoveryService {

    private final SubmissionRepository submissionRepository;

    @Getter
    @Setter
    @Value("${application.submission.stale-timeout-minutes:5}")
    private int staleTimeoutMinutes = 5;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        log.info("Running startup check for stale submissions...");
        recoverStaleSubmissions();
    }

    @Scheduled(fixedRateString = "${application.submission.recovery-interval-ms:60000}")
    @Transactional
    public int recoverStaleSubmissions() {
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(staleTimeoutMinutes));
        List<SubmissionStatus> staleStatuses = List.of(SubmissionStatus.PENDING, SubmissionStatus.RUNNING);

        List<Submission> staleSubmissions = submissionRepository.findByStatusInAndSubmittedAtBefore(staleStatuses, cutoff);

        if (staleSubmissions.isEmpty()) {
            return 0;
        }

        log.warn("Found {} stale submissions stuck in PENDING or RUNNING past {} minutes timeout",
                staleSubmissions.size(), staleTimeoutMinutes);

        int recoveredCount = 0;
        for (Submission submission : staleSubmissions) {
            SubmissionStatus oldStatus = submission.getStatus();
            submission.setStatus(SubmissionStatus.RUNTIME_ERROR);
            submission.setFailureMessage(
                    String.format("Evaluation timed out or was interrupted by system recovery (was %s for >%d mins).", oldStatus, staleTimeoutMinutes)
            );
            submission.setCompletedAt(Instant.now());
            submissionRepository.save(submission);
            recoveredCount++;
            log.info("Recovered stale submission {} (status was {})", submission.getId(), oldStatus);
        }

        return recoveredCount;
    }
}
