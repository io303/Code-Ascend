package com.codearenaai.problem.dto;

import com.codearenaai.problem.model.ProblemDifficulty;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDetailResponse {
    private UUID id;
    private String slug;
    private String title;
    private ProblemDifficulty difficulty;
    private String description;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private String examplesJson;
    private String sampleInput;
    private String sampleOutput;
    private BigDecimal acceptanceRate;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private Set<String> tags;
    private List<TestCaseResponse> visibleTestCases;
    private Instant createdAt;
}
