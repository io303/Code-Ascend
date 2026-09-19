package com.codearenaai.rating.service;

import com.codearenaai.leaderboard.service.LeaderboardService;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.ProblemDifficulty;
import com.codearenaai.rating.model.RatingHistory;
import com.codearenaai.rating.repository.RatingHistoryRepository;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RatingService {

    private final UserRepository userRepository;
    private final RatingHistoryRepository ratingHistoryRepository;
    private final SubmissionRepository submissionRepository;
    private final LeaderboardService leaderboardService;

    public int calculateRatingDelta(int currentRating, ProblemDifficulty difficulty) {
        int problemRating = switch (difficulty) {
            case EASY -> 1200;
            case MEDIUM -> 1500;
            case HARD -> 1800;
        };

        double expectedScore = 1.0 / (1.0 + Math.pow(10.0, (problemRating - currentRating) / 400.0));
        int delta = (int) Math.round(32.0 * (1.0 - expectedScore));
        return Math.max(5, delta);
    }

    @Transactional
    public int processAcceptedSolve(User user, Problem problem, Submission submission) {
        List<Submission> previousAccepted = submissionRepository.findByProblemIdAndStatus(problem.getId(), SubmissionStatus.ACCEPTED);
        boolean alreadySolvedBefore = previousAccepted.stream()
                .anyMatch(s -> s.getUser().getId().equals(user.getId()) && !s.getId().equals(submission.getId()));

        if (alreadySolvedBefore) {
            log.info("User {} re-solved problem {}, 0 Elo delta awarded.", user.getUsername(), problem.getSlug());
            return 0;
        }

        int previousRating = user.getRating();
        int delta = calculateRatingDelta(previousRating, problem.getDifficulty());
        int newRating = previousRating + delta;

        user.setRating(newRating);
        userRepository.save(user);
        leaderboardService.updateRatingInLeaderboard(user);

        RatingHistory history = RatingHistory.builder()
                .user(user)
                .problem(problem)
                .submission(submission)
                .previousRating(previousRating)
                .newRating(newRating)
                .ratingDelta(delta)
                .reason("Solved problem: " + problem.getTitle())
                .createdAt(Instant.now())
                .build();

        ratingHistoryRepository.save(history);
        log.info("Awarded +{} Elo to user {} for solving {} (Old: {}, New: {})",
                delta, user.getUsername(), problem.getTitle(), previousRating, newRating);

        return delta;
    }

    @Transactional(readOnly = true)
    public List<RatingHistory> getRatingHistoryForUser(UUID userId) {
        return ratingHistoryRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }
}
