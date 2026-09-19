package com.codearenaai.submission.model;

import com.codearenaai.problem.model.Problem;
import com.codearenaai.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@Getter
@Setter
@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "evaluation_id", nullable = false, unique = true, updatable = false)
    private UUID evaluationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false, length = 30)
    private SubmissionLanguage language;

    @Column(name = "source_code", nullable = false, columnDefinition = "text")
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 40)
    private SubmissionStatus status;

    @Column(name = "runtime_ms")
    private Integer runtimeMs;

    @Column(name = "memory_kb")
    private Integer memoryKb;

    @Column(name = "queue_key", length = 120)
    private String queueKey;

    @Column(name = "queued_at", nullable = false)
    private Instant queuedAt;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "failure_message", columnDefinition = "text")
    private String failureMessage;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Instant submittedAt;

    @Column(name = "ai_hint", columnDefinition = "text")
    private String aiHint;

    @Column(name = "ai_complexity_json", columnDefinition = "text")
    private String aiComplexityJson;

    @Column(name = "ai_plagiarism_score")
    private Integer aiPlagiarismScore;

    @Column(name = "ai_feedback", columnDefinition = "text")
    private String aiFeedback;

    @PrePersist
    void onCreate() {
        if (evaluationId == null) {
            evaluationId = UUID.randomUUID();
        }
        if (queuedAt == null) {
            queuedAt = Instant.now();
        }
        if (submittedAt == null) {
            submittedAt = Instant.now();
        }
    }
}
