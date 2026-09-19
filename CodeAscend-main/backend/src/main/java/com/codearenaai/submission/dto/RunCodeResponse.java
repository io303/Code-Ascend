package com.codearenaai.submission.dto;

import com.codearenaai.submission.model.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunCodeResponse {
    private SubmissionStatus status;
    private String stdout;
    private String failureMessage;
    private Integer runtimeMs;
    private Integer memoryKb;
    private String expectedOutput;
}
