package com.codearenaai.submission.eval;

import com.codearenaai.submission.model.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResult {
    private SubmissionStatus status;
    private Integer runtimeMs;
    private Integer memoryKb;
    private String failureMessage;
    private int passedTestCases;
    private int totalTestCases;
}
