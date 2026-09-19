package com.codearenaai.user.service;

import com.codearenaai.leaderboard.service.LeaderboardService;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.ProblemDifficulty;
import com.codearenaai.problem.repository.ProblemRepository;
import com.codearenaai.rating.model.RatingHistory;
import com.codearenaai.rating.repository.RatingHistoryRepository;
import com.codearenaai.submission.dto.SubmissionResponse;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.dto.UserProfileResponse;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final LeaderboardService leaderboardService;
    private final RatingHistoryRepository ratingHistoryRepository;

    public UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with username: " + username));

        long rank = userRepository.countByRatingGreaterThan(user.getRating()) + 1;
        long problemsSolved = submissionRepository.countDistinctSolvedProblemsByUserId(user.getId());
        long totalSubmissions = submissionRepository.countByUserId(user.getId());
        long acceptedSubmissions = submissionRepository.countByUserIdAndStatus(user.getId(), SubmissionStatus.ACCEPTED);
        double acceptanceRate = totalSubmissions > 0 ? (acceptedSubmissions * 100.0 / totalSubmissions) : 0.0;
        int streak = leaderboardService.calculateUserStreak(user.getId());

        List<Submission> userSubmissions = submissionRepository.findAllByUserIdOrderBySubmittedAtDesc(user.getId());

        // Heatmap (365 days)
        Map<String, Integer> heatmap = new LinkedHashMap<>();
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        for (Submission s : userSubmissions) {
            LocalDate d = s.getSubmittedAt().atZone(ZoneId.of("UTC")).toLocalDate();
            if (!d.isBefore(today.minusDays(365))) {
                String dateStr = d.toString();
                heatmap.put(dateStr, heatmap.getOrDefault(dateStr, 0) + 1);
            }
        }

        // Difficulty breakdown & Topic performance
        List<UUID> solvedProblemIds = submissionRepository.findSolvedProblemIdsByUserId(user.getId());
        Map<String, Long> difficultyBreakdown = new HashMap<>();
        difficultyBreakdown.put("EASY", 0L);
        difficultyBreakdown.put("MEDIUM", 0L);
        difficultyBreakdown.put("HARD", 0L);

        Map<String, Long> topicPerformance = new HashMap<>();

        if (!solvedProblemIds.isEmpty()) {
            List<Problem> solvedProblems = problemRepository.findAllById(solvedProblemIds);
            for (Problem p : solvedProblems) {
                String diffKey = p.getDifficulty().name();
                difficultyBreakdown.put(diffKey, difficultyBreakdown.getOrDefault(diffKey, 0L) + 1);

                if (p.getTags() != null) {
                    for (String tag : p.getTags()) {
                        topicPerformance.put(tag, topicPerformance.getOrDefault(tag, 0L) + 1);
                    }
                }
            }
        }

        // Code DNA Computation
        List<String> defaultTopics = List.of("Arrays", "Strings", "Trees", "Graphs", "DP", "Greedy", "Binary Search", "Math", "Hash Table");
        List<UserProfileResponse.TopicSkill> topicSkills = new ArrayList<>();

        for (String topic : defaultTopics) {
            long count = topicPerformance.getOrDefault(topic, 0L);
            int score = (int) Math.min(100, count * 25);
            topicSkills.add(UserProfileResponse.TopicSkill.builder()
                    .topic(topic)
                    .score(score)
                    .solvedCount(count)
                    .build());
        }

        String strongestTopic = topicSkills.stream()
                .max(Comparator.comparingLong(UserProfileResponse.TopicSkill::getSolvedCount))
                .map(UserProfileResponse.TopicSkill::getTopic)
                .orElse("Arrays");

        String weakestTopic = topicSkills.stream()
                .min(Comparator.comparingLong(UserProfileResponse.TopicSkill::getSolvedCount))
                .map(UserProfileResponse.TopicSkill::getTopic)
                .orElse("DP");

        String mostImprovedTopic = topicSkills.stream()
                .filter(ts -> ts.getSolvedCount() > 0)
                .max(Comparator.comparingInt(UserProfileResponse.TopicSkill::getScore))
                .map(UserProfileResponse.TopicSkill::getTopic)
                .orElse(strongestTopic);

        // Real Recommended Next Problem derived from weakest topic & user rating/difficulty
        List<Problem> allProblems = problemRepository.findAll();
        Set<UUID> solvedSet = Set.copyOf(solvedProblemIds);
        Problem recommendedProblem = allProblems.stream()
                .filter(p -> !solvedSet.contains(p.getId()))
                .filter(p -> p.getTags() != null && p.getTags().stream().anyMatch(t -> t.equalsIgnoreCase(weakestTopic)))
                .findFirst()
                .orElseGet(() -> allProblems.stream()
                        .filter(p -> !solvedSet.contains(p.getId()))
                        .findFirst()
                        .orElse(allProblems.isEmpty() ? null : allProblems.get(0))
                );

        String recommendedSlug = recommendedProblem != null ? recommendedProblem.getSlug() : "two-sum";
        String recommendedTitle = recommendedProblem != null ? recommendedProblem.getTitle() : "Two Sum";

        UserProfileResponse.CodeDna codeDna = UserProfileResponse.CodeDna.builder()
                .topicSkills(topicSkills)
                .strongestTopic(strongestTopic)
                .weakestTopic(weakestTopic)
                .mostImprovedTopic(mostImprovedTopic)
                .overallSkillRating(user.getRating())
                .recommendedProblemSlug(recommendedSlug)
                .recommendedProblemTitle(recommendedTitle)
                .build();

        // Rating History
        List<RatingHistory> dbHistory = ratingHistoryRepository.findByUserIdOrderByCreatedAtAsc(user.getId());
        List<UserProfileResponse.RatingHistoryPoint> ratingHistoryPoints = dbHistory.stream()
                .map(rh -> UserProfileResponse.RatingHistoryPoint.builder()
                        .id(rh.getId())
                        .previousRating(rh.getPreviousRating())
                        .newRating(rh.getNewRating())
                        .ratingDelta(rh.getRatingDelta())
                        .reason(rh.getReason())
                        .createdAt(rh.getCreatedAt())
                        .build())
                .toList();

        // Achievements derived from real DB data
        List<UserProfileResponse.AchievementBadge> achievements = new ArrayList<>();
        achievements.add(UserProfileResponse.AchievementBadge.builder()
                .id("first_ac")
                .title("First Blood")
                .description("Solved your first algorithm problem")
                .icon("🎯")
                .unlocked(problemsSolved >= 1)
                .build());

        achievements.add(UserProfileResponse.AchievementBadge.builder()
                .id("ten_solved")
                .title("Problem Solver")
                .description("Solved 10 algorithm problems")
                .icon("🚀")
                .unlocked(problemsSolved >= 10)
                .build());

        achievements.add(UserProfileResponse.AchievementBadge.builder()
                .id("hard_hitter")
                .title("Hard Hitter")
                .description("Solved your first HARD algorithm problem")
                .icon("⚡")
                .unlocked(difficultyBreakdown.getOrDefault("HARD", 0L) >= 1)
                .build());

        achievements.add(UserProfileResponse.AchievementBadge.builder()
                .id("streak_master")
                .title("Daily Warrior")
                .description("Maintained a 3-day coding streak")
                .icon("🔥")
                .unlocked(streak >= 3)
                .build());

        achievements.add(UserProfileResponse.AchievementBadge.builder()
                .id("climber")
                .title("Rating Climber")
                .description("Gained rating to reach 1300+ Elo")
                .icon("📈")
                .unlocked(user.getRating() >= 1300)
                .build());

        achievements.add(UserProfileResponse.AchievementBadge.builder()
                .id("versatile")
                .title("Versatile Master")
                .description("Solved problems across 5+ topic categories")
                .icon("🧩")
                .unlocked(topicPerformance.size() >= 5)
                .build());

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

        return UserProfileResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .email(user.getEmail())
                .rating(user.getRating())
                .rank(rank)
                .tier(leaderboardService.calculateTier(user.getRating()))
                .problemsSolved(problemsSolved)
                .totalSubmissions(totalSubmissions)
                .acceptanceRate(Math.round(acceptanceRate * 10.0) / 10.0)
                .streak(streak)
                .difficultyBreakdown(difficultyBreakdown)
                .topicPerformance(topicPerformance)
                .submissionHeatmap(heatmap)
                .achievements(achievements)
                .recentSubmissions(recentSubmissions)
                .ratingHistory(ratingHistoryPoints)
                .codeDna(codeDna)
                .build();
    }
}
