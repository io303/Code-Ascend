package com.codearenaai.analytics.dto;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformAnalyticsResponse {
    private long totalUsers;
    private long totalSubmissions;
    private long totalProblems;
    private double acceptanceRate;
    private double averageUserRating;
    private Map<String, Long> submissionsByDay;
    private Map<String, Long> difficultyDistribution;
    private Map<String, Long> topLanguages;
}
