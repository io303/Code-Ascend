package com.codearenaai.leaderboard.service;

import com.codearenaai.common.dto.PagedResponse;
import com.codearenaai.leaderboard.dto.LeaderboardEntryResponse;
import com.codearenaai.leaderboard.dto.UserRankResponse;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaderboardService {

    private static final String LEADERBOARD_KEY = "leaderboard:global";
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public void updateRatingInLeaderboard(User user) {
        try {
            if (redisTemplate != null) {
                redisTemplate.opsForZSet().add(LEADERBOARD_KEY, user.getId().toString(), user.getRating());
            }
        } catch (Exception e) {
            log.warn("Redis leaderboard update failed, degrading gracefully to database: {}", e.getMessage());
        }
    }

    public PagedResponse<LeaderboardEntryResponse> getLeaderboard(int page, int size) {
        Page<User> userPage = userRepository.findAllByOrderByRatingDescUsernameAsc(PageRequest.of(page, size));

        List<LeaderboardEntryResponse> entries = new ArrayList<>();
        long startRank = (long) page * size + 1;

        for (int i = 0; i < userPage.getContent().size(); i++) {
            User u = userPage.getContent().get(i);
            long rank = startRank + i;
            long solved = submissionRepository.countDistinctSolvedProblemsByUserId(u.getId());
            int streak = calculateUserStreak(u.getId());

            entries.add(LeaderboardEntryResponse.builder()
                    .rank(rank)
                    .userId(u.getId())
                    .username(u.getUsername())
                    .displayName(u.getDisplayName())
                    .rating(u.getRating())
                    .solvedCount(solved)
                    .streak(streak)
                    .tier(calculateTier(u.getRating()))
                    .build());
        }

        return PagedResponse.<LeaderboardEntryResponse>builder()
                .content(entries)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    public UserRankResponse getUserRank(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        long rank = 1;
        try {
            if (redisTemplate != null) {
                Long revRank = redisTemplate.opsForZSet().reverseRank(LEADERBOARD_KEY, userId.toString());
                if (revRank != null) {
                    rank = revRank + 1;
                } else {
                    rank = userRepository.countByRatingGreaterThan(user.getRating()) + 1;
                    redisTemplate.opsForZSet().add(LEADERBOARD_KEY, userId.toString(), user.getRating());
                }
            } else {
                rank = userRepository.countByRatingGreaterThan(user.getRating()) + 1;
            }
        } catch (Exception e) {
            log.warn("Redis user rank lookup failed, using database rank: {}", e.getMessage());
            rank = userRepository.countByRatingGreaterThan(user.getRating()) + 1;
        }

        long solved = submissionRepository.countDistinctSolvedProblemsByUserId(user.getId());
        int streak = calculateUserStreak(user.getId());

        return UserRankResponse.builder()
                .rank(rank)
                .userId(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .rating(user.getRating())
                .solvedCount(solved)
                .streak(streak)
                .tier(calculateTier(user.getRating()))
                .build();
    }

    public int calculateUserStreak(UUID userId) {
        // Calculate streak from submission history
        List<com.codearenaai.submission.model.Submission> submissions = submissionRepository.findAllByUserIdOrderBySubmittedAtDesc(userId);
        if (submissions.isEmpty()) {
            return 0;
        }

        java.util.Set<java.time.LocalDate> activeDates = submissions.stream()
                .map(s -> s.getSubmittedAt().atZone(java.time.ZoneId.of("UTC")).toLocalDate())
                .collect(java.util.stream.Collectors.toSet());

        java.time.LocalDate today = java.time.LocalDate.now(java.time.ZoneId.of("UTC"));
        java.time.LocalDate checkDate = activeDates.contains(today) ? today : today.minusDays(1);

        int streak = 0;
        while (activeDates.contains(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }

        return streak;
    }

    public String calculateTier(int rating) {
        if (rating >= 2400) return "Grandmaster";
        if (rating >= 2000) return "Master";
        if (rating >= 1800) return "Candidate Master";
        if (rating >= 1500) return "Specialist";
        if (rating >= 1200) return "Pupil";
        return "Newbie";
    }
}
