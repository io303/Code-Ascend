package com.codearenaai.analytics.service;

import com.codearenaai.analytics.dto.PlatformAnalyticsResponse;
import com.codearenaai.analytics.dto.UserAnalyticsResponse;
import com.codearenaai.leaderboard.service.LeaderboardService;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.repository.ProblemRepository;
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
import java.util.TreeMap;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final LeaderboardService leaderboardService;

    public PlatformAnalyticsResponse getPlatformAnalytics() {
        long totalUsers = userRepository.count();
        long totalSubmissions = submissionRepository.count();
        long totalProblems = problemRepository.count();
        long totalAccepted = submissionRepository.countByStatus(SubmissionStatus.ACCEPTED);

        double acceptanceRate = totalSubmissions > 0 ? (totalAccepted * 100.0 / totalSubmissions) : 0.0;
        Double avgRating = userRepository.findAverageRating();

        // Submissions by day for past 30 days
        Map<String, Long> submissionsByDay = new TreeMap<>();
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        for (int i = 29; i >= 0; i--) {
            submissionsByDay.put(today.minusDays(i).toString(), 0L);
        }

        List<Submission> allSubmissions = submissionRepository.findAll();
        for (Submission s : allSubmissions) {
            LocalDate d = s.getSubmittedAt().atZone(ZoneId.of("UTC")).toLocalDate();
            if (submissionsByDay.containsKey(d.toString())) {
                submissionsByDay.put(d.toString(), submissionsByDay.get(d.toString()) + 1);
            }
        }

        // Difficulty distribution of problems
        Map<String, Long> difficultyDist = new HashMap<>();
        difficultyDist.put("EASY", 0L);
        difficultyDist.put("MEDIUM", 0L);
        difficultyDist.put("HARD", 0L);

        List<Problem> problems = problemRepository.findAll();
        for (Problem p : problems) {
            String key = p.getDifficulty().name();
            difficultyDist.put(key, difficultyDist.getOrDefault(key, 0L) + 1);
        }

        // Top languages used
        Map<String, Long> topLanguages = new HashMap<>();
        for (Submission s : allSubmissions) {
            String lang = s.getLanguage().name();
            topLanguages.put(lang, topLanguages.getOrDefault(lang, 0L) + 1);
        }

        return PlatformAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalSubmissions(totalSubmissions)
                .totalProblems(totalProblems)
                .acceptanceRate(Math.round(acceptanceRate * 10.0) / 10.0)
                .averageUserRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 1200.0)
                .submissionsByDay(submissionsByDay)
                .difficultyDistribution(difficultyDist)
                .topLanguages(topLanguages)
                .build();
    }

    public UserAnalyticsResponse getUserAnalytics(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        long totalSubmissions = submissionRepository.countByUserId(userId);
        long acceptedSubmissions = submissionRepository.countByUserIdAndStatus(userId, SubmissionStatus.ACCEPTED);
        long problemsSolved = submissionRepository.countDistinctSolvedProblemsByUserId(userId);
        double acceptanceRate = totalSubmissions > 0 ? (acceptedSubmissions * 100.0 / totalSubmissions) : 0.0;
        int streak = leaderboardService.calculateUserStreak(userId);

        List<Submission> userSubmissions = submissionRepository.findAllByUserIdOrderBySubmittedAtDesc(userId);

        // Submissions by day past 30 days
        Map<String, Long> submissionsByDay = new TreeMap<>();
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        for (int i = 29; i >= 0; i--) {
            submissionsByDay.put(today.minusDays(i).toString(), 0L);
        }

        for (Submission s : userSubmissions) {
            LocalDate d = s.getSubmittedAt().atZone(ZoneId.of("UTC")).toLocalDate();
            if (submissionsByDay.containsKey(d.toString())) {
                submissionsByDay.put(d.toString(), submissionsByDay.get(d.toString()) + 1);
            }
        }

        // Difficulty breakdown of solved problems
        List<UUID> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(userId);
        Map<String, Long> difficultyDist = new HashMap<>();
        difficultyDist.put("EASY", 0L);
        difficultyDist.put("MEDIUM", 0L);
        difficultyDist.put("HARD", 0L);

        if (!solvedProblemIds.isEmpty()) {
            List<Problem> solvedProblems = problemRepository.findAllById(solvedProblemIds);
            for (Problem p : solvedProblems) {
                String key = p.getDifficulty().name();
                difficultyDist.put(key, difficultyDist.getOrDefault(key, 0L) + 1);
            }
        }

        // Language breakdown
        Map<String, Long> languageBreakdown = new HashMap<>();
        for (Submission s : userSubmissions) {
            String lang = s.getLanguage().name();
            languageBreakdown.put(lang, languageBreakdown.getOrDefault(lang, 0L) + 1);
        }

        return UserAnalyticsResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .rating(user.getRating())
                .totalSubmissions(totalSubmissions)
                .problemsSolved(problemsSolved)
                .acceptanceRate(Math.round(acceptanceRate * 10.0) / 10.0)
                .streak(streak)
                .submissionsByDay(submissionsByDay)
                .difficultyDistribution(difficultyDist)
                .languageBreakdown(languageBreakdown)
                .build();
    }
}
