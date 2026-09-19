package com.codearenaai.dashboard.dto;

import com.codearenaai.leaderboard.dto.LeaderboardEntryResponse;
import com.codearenaai.problem.dto.ProblemSummaryResponse;
import com.codearenaai.submission.dto.SubmissionResponse;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long problemsSolved;
    private int currentRating;
    private long totalSubmissions;
    private double acceptanceRate;
    private int streak;
    private Map<String, Integer> submissionHeatmap;
    private Map<String, Long> difficultyBreakdown;
    private List<SubmissionResponse> recentSubmissions;
    private List<LeaderboardEntryResponse> leaderboardPreview;
    private List<ProblemSummaryResponse> recommendedProblems;
}
