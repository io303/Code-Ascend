package com.codearenaai.submission.event;

import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionEvent implements Serializable {
    private UUID submissionId;
    private UUID evaluationId;
    private UUID problemId;
    private UUID userId;
    private String language;
    private String sourceCode;
}
