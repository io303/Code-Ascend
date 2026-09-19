package com.codearenaai.submission.dto;

import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.model.SubmissionStatus;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDetailResponse {
    private UUID id;
    private UUID evaluationId;
    private UUID problemId;
    private String problemSlug;
    private String problemTitle;
    private UUID userId;
    private String username;
    private SubmissionLanguage language;
    private String sourceCode;
    private SubmissionStatus status;
    private Integer runtimeMs;
    private Integer memoryKb;
    private String queueKey;
    private Instant queuedAt;
    private Instant startedAt;
    private Instant completedAt;
    private String failureMessage;
    private Instant submittedAt;
    private String aiHint;
    private String aiComplexityJson;
    private Integer aiPlagiarismScore;
    private String aiFeedback;
    private Integer passedTestCasesCount;
    private Integer totalTestCasesCount;
    private Integer ratingDelta;
}
