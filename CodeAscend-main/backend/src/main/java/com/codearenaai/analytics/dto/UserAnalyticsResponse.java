package com.codearenaai.analytics.dto;

import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalyticsResponse {
    private UUID userId;
    private String username;
    private String displayName;
    private int rating;
    private long totalSubmissions;
    private long problemsSolved;
    private double acceptanceRate;
    private int streak;
    private Map<String, Long> submissionsByDay;
    private Map<String, Long> difficultyDistribution;
    private Map<String, Long> languageBreakdown;
}
