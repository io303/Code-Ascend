package com.codearenaai.rating;

import com.codearenaai.AbstractEmbeddedPostgresIntegrationTest;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.ProblemDifficulty;
import com.codearenaai.problem.repository.ProblemRepository;
import com.codearenaai.rating.model.RatingHistory;
import com.codearenaai.rating.service.RatingService;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionLanguage;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.model.User;
import com.codearenaai.user.model.UserRole;
import com.codearenaai.user.repository.UserRepository;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RatingServiceTest extends AbstractEmbeddedPostgresIntegrationTest {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Test
    void eloCalculationProducesDeterministicDeltas() {
        int deltaEasy = ratingService.calculateRatingDelta(1200, ProblemDifficulty.EASY);
        int deltaHard = ratingService.calculateRatingDelta(1200, ProblemDifficulty.HARD);

        Assertions.assertTrue(deltaEasy >= 5, "Minimum delta should be 5");
        Assertions.assertTrue(deltaHard > deltaEasy, "Hard problems should award higher Elo delta than Easy problems");
    }

    @Test
    void processAcceptedSolveUpdatesRatingAndPreventsFarming() {
        User user = new User();
        user.setUsername("elotester_" + System.currentTimeMillis());
        user.setEmail("elotester_" + System.currentTimeMillis() + "@test.com");
        user.setDisplayName("Elo Tester");
        user.setPasswordHash("hashedpass");
        user.setRole(UserRole.USER);
        user.setRating(1200);
        user = userRepository.save(user);

        Problem problem = problemRepository.findAll().stream().findFirst().orElseThrow();

        // First solve
        Submission sub1 = new Submission();
        sub1.setUser(user);
        sub1.setProblem(problem);
        sub1.setLanguage(SubmissionLanguage.PYTHON);
        sub1.setSourceCode("print('test')");
        sub1.setStatus(SubmissionStatus.ACCEPTED);
        sub1 = submissionRepository.save(sub1);

        int delta1 = ratingService.processAcceptedSolve(user, problem, sub1);
        Assertions.assertTrue(delta1 > 0, "First solve should award positive Elo delta");
        Assertions.assertEquals(1200 + delta1, user.getRating(), "User rating should be updated in DB");

        List<RatingHistory> history = ratingService.getRatingHistoryForUser(user.getId());
        Assertions.assertEquals(1, history.size(), "Should have exactly 1 rating history event");
        Assertions.assertEquals(1200, history.get(0).getPreviousRating());
        Assertions.assertEquals(1200 + delta1, history.get(0).getNewRating());

        // Second solve for SAME problem (prevent farming test)
        Submission sub2 = new Submission();
        sub2.setUser(user);
        sub2.setProblem(problem);
        sub2.setLanguage(SubmissionLanguage.PYTHON);
        sub2.setSourceCode("print('test 2')");
        sub2.setStatus(SubmissionStatus.ACCEPTED);
        sub2 = submissionRepository.save(sub2);

        int delta2 = ratingService.processAcceptedSolve(user, problem, sub2);
        Assertions.assertEquals(0, delta2, "Re-solving the same problem MUST award 0 Elo delta to prevent farming!");

        List<RatingHistory> historyAfterSecondSolve = ratingService.getRatingHistoryForUser(user.getId());
        Assertions.assertEquals(1, historyAfterSecondSolve.size(), "Re-solving should NOT create duplicate rating history events");
    }
}
