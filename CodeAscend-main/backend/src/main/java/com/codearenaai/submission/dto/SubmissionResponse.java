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
public class SubmissionResponse {
    private UUID id;
    private UUID evaluationId;
    private UUID problemId;
    private String problemSlug;
    private String problemTitle;
    private UUID userId;
    private String username;
    private SubmissionLanguage language;
    private SubmissionStatus status;
    private Integer runtimeMs;
    private Integer memoryKb;
    private String failureMessage;
    private Instant submittedAt;
    private Instant completedAt;
}
