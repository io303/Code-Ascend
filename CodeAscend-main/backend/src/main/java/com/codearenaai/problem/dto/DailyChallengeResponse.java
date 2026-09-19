package com.codearenaai.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyChallengeResponse {
    private ProblemSummaryResponse problem;
    private String date;
    private boolean solvedByCurrentUser;
    private int estimatedEloGain;
}
