package com.codearenaai.dashboard.service;

import com.codearenaai.dashboard.dto.DashboardResponse;
import com.codearenaai.leaderboard.dto.LeaderboardEntryResponse;
import com.codearenaai.leaderboard.service.LeaderboardService;
import com.codearenaai.problem.dto.ProblemSummaryResponse;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.ProblemDifficulty;
import com.codearenaai.problem.repository.ProblemRepository;
import com.codearenaai.submission.dto.SubmissionResponse;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final LeaderboardService leaderboardService;

    public DashboardResponse getDashboardForUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        long problemsSolved = submissionRepository.countDistinctSolvedProblemsByUserId(userId);
        long totalSubmissions = submissionRepository.countByUserId(userId);
        long acceptedSubmissions = submissionRepository.countByUserIdAndStatus(userId, SubmissionStatus.ACCEPTED);
        double acceptanceRate = totalSubmissions > 0 ? (acceptedSubmissions * 100.0 / totalSubmissions) : 0.0;

        int streak = leaderboardService.calculateUserStreak(userId);

        List<Submission> userSubmissions = submissionRepository.findAllByUserIdOrderBySubmittedAtDesc(userId);

        // Heatmap for past 365 days
        Map<String, Integer> heatmap = new LinkedHashMap<>();
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        for (Submission s : userSubmissions) {
            LocalDate d = s.getSubmittedAt().atZone(ZoneId.of("UTC")).toLocalDate();
            if (!d.isBefore(today.minusDays(365))) {
                String dateStr = d.toString();
                heatmap.put(dateStr, heatmap.getOrDefault(dateStr, 0) + 1);
            }
        }

        // Difficulty breakdown of solved problems
        List<UUID> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        Map<String, Long> difficultyBreakdown = new HashMap<>();
        difficultyBreakdown.put("EASY", 0L);
        difficultyBreakdown.put("MEDIUM", 0L);
        difficultyBreakdown.put("HARD", 0L);

        if (!solvedProblemIds.isEmpty()) {
            List<Problem> solvedProblems = problemRepository.findAllById(solvedProblemIds);
            for (Problem p : solvedProblems) {
                String diffKey = p.getDifficulty().name();
                difficultyBreakdown.put(diffKey, difficultyBreakdown.getOrDefault(diffKey, 0L) + 1);
            }
        }

        // Recent 5 submissions
        List<SubmissionResponse> recentSubmissions = userSubmissions.stream()
                .limit(5)
                .map(s -> SubmissionResponse.builder()
                        .id(s.getId())
                        .evaluationId(s.getEvaluationId())
                        .problemId(s.getProblem().getId())
                        .problemSlug(s.getProblem().getSlug())
                        .problemTitle(s.getProblem().getTitle())
                        .userId(s.getUser().getId())
                        .username(s.getUser().getUsername())
                        .language(s.getLanguage())
                        .status(s.getStatus())
                        .runtimeMs(s.getRuntimeMs())
                        .memoryKb(s.getMemoryKb())
                        .failureMessage(s.getFailureMessage())
                        .submittedAt(s.getSubmittedAt())
                        .completedAt(s.getCompletedAt())
                        .build())
                .toList();

        // Leaderboard preview (top 5)
        List<LeaderboardEntryResponse> leaderboardPreview = leaderboardService.getLeaderboard(0, 5).getContent();

        // Recommended problems (unsolved or matching user level)
        List<Problem> allProblems = problemRepository.findAll();
        Set<UUID> solvedSet = Set.copyOf(solvedProblemIds);

        List<ProblemSummaryResponse> recommended = allProblems.stream()
                .filter(p -> !solvedSet.contains(p.getId()))
                .limit(4)
                .map(p -> ProblemSummaryResponse.builder()
                        .id(p.getId())
                        .slug(p.getSlug())
                        .title(p.getTitle())
                        .difficulty(p.getDifficulty())
                        .acceptanceRate(p.getAcceptanceRate())
                        .timeLimitMs(p.getTimeLimitMs())
                        .memoryLimitMb(p.getMemoryLimitMb())
                        .tags(p.getTags() != null ? Set.copyOf(p.getTags()) : Set.of())
                        .createdAt(p.getCreatedAt())
                        .build())
                .toList();

        return DashboardResponse.builder()
                .problemsSolved(problemsSolved)
                .currentRating(user.getRating())
                .totalSubmissions(totalSubmissions)
                .acceptanceRate(Math.round(acceptanceRate * 10.0) / 10.0)
                .streak(streak)
                .submissionHeatmap(heatmap)
                .difficultyBreakdown(difficultyBreakdown)
                .recentSubmissions(recentSubmissions)
                .leaderboardPreview(leaderboardPreview)
                .recommendedProblems(recommended)
                .build();
    }
}
