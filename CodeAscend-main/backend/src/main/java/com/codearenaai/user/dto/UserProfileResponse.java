package com.codearenaai.user.dto;

import com.codearenaai.submission.dto.SubmissionResponse;
import java.time.Instant;
import java.util.List;
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
public class UserProfileResponse {
    private UUID userId;
    private String username;
    private String displayName;
    private String email;
    private Integer rating;
    private Long rank;
    private String tier;
    private Long problemsSolved;
    private Long totalSubmissions;
    private Double acceptanceRate;
    private Integer streak;
    private Map<String, Long> difficultyBreakdown;
    private Map<String, Long> topicPerformance;
    private Map<String, Integer> submissionHeatmap;
    private List<AchievementBadge> achievements;
    private List<SubmissionResponse> recentSubmissions;
    private List<RatingHistoryPoint> ratingHistory;
    private CodeDna codeDna;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingHistoryPoint {
        private UUID id;
        private Integer previousRating;
        private Integer newRating;
        private Integer ratingDelta;
        private String reason;
        private Instant createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeDna {
        private List<TopicSkill> topicSkills;
        private String strongestTopic;
        private String weakestTopic;
        private String mostImprovedTopic;
        private Integer overallSkillRating;
        private String recommendedProblemSlug;
        private String recommendedProblemTitle;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicSkill {
        private String topic;
        private Integer score;
        private Long solvedCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AchievementBadge {
        private String id;
        private String title;
        private String description;
        private String icon;
        private Boolean unlocked;
    }
}
