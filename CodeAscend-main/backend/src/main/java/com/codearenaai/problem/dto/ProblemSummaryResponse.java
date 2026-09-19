package com.codearenaai.problem.dto;

import com.codearenaai.problem.model.ProblemDifficulty;
import java.math.BigDecimal;
import java.time.Instant;
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
public class ProblemSummaryResponse {
    private UUID id;
    private String slug;
    private String title;
    private ProblemDifficulty difficulty;
    private BigDecimal acceptanceRate;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private Set<String> tags;
    private Instant createdAt;
    private String userStatus;
    private Boolean isBookmarked;
}
