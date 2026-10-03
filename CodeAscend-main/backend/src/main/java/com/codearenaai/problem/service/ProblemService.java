package com.codearenaai.problem.service;

import com.codearenaai.common.dto.PagedResponse;
import com.codearenaai.problem.dto.DailyChallengeResponse;
import com.codearenaai.problem.dto.ProblemDetailResponse;
import com.codearenaai.problem.dto.ProblemSummaryResponse;
import com.codearenaai.problem.dto.TestCaseResponse;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.model.ProblemBookmark;
import com.codearenaai.problem.model.ProblemDifficulty;
import com.codearenaai.problem.repository.ProblemBookmarkRepository;
import com.codearenaai.problem.repository.ProblemRepository;
import com.codearenaai.rating.service.RatingService;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final ProblemBookmarkRepository bookmarkRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final RatingService ratingService;

    public ProblemService(
            ProblemRepository problemRepository,
            ProblemBookmarkRepository bookmarkRepository,
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            RatingService ratingService
    ) {
        this.problemRepository = problemRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.ratingService = ratingService;
    }

    public PagedResponse<ProblemSummaryResponse> getProblems(
            int page,
            int size,
            String search,
            ProblemDifficulty difficulty,
            String tag,
            String sortBy,
            String sortOrder,
            UUID currentUserId
    ) {
        Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String field = getValidSortField(sortBy);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, field));

        Specification<Problem> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }

            if (tag != null && !tag.trim().isEmpty()) {
                Join<Problem, String> tagsJoin = root.join("tags");
                predicates.add(cb.equal(cb.lower(tagsJoin), tag.trim().toLowerCase()));
            }

            query.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Problem> problemPage = problemRepository.findAll(spec, pageable);

        Set<UUID> bookmarkedIds = Set.of();
        Map<UUID, String> problemStatuses = Map.of();

        if (currentUserId != null) {
            bookmarkedIds = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(currentUserId).stream()
                    .map(b -> b.getProblem().getId())
                    .collect(Collectors.toSet());

            List<Submission> userSubmissions = submissionRepository.findAllByUserIdOrderBySubmittedAtDesc(currentUserId);
            problemStatuses = userSubmissions.stream()
                    .collect(Collectors.toMap(
                            s -> s.getProblem().getId(),
                            s -> s.getStatus() == SubmissionStatus.ACCEPTED ? "SOLVED" : "ATTEMPTED",
                            (existing, replacement) -> "SOLVED".equals(existing) ? existing : replacement
                    ));
        }

        final Set<UUID> finalBookmarkedIds = bookmarkedIds;
        final Map<UUID, String> finalStatuses = problemStatuses;

        List<ProblemSummaryResponse> content = problemPage.getContent().stream()
                .map(p -> {
                    ProblemSummaryResponse resp = mapToSummary(p);
                    if (currentUserId != null) {
                        resp.setIsBookmarked(finalBookmarkedIds.contains(p.getId()));
                        resp.setUserStatus(finalStatuses.getOrDefault(p.getId(), "UNATTEMPTED"));
                    }
                    return resp;
                })
                .toList();

        return PagedResponse.<ProblemSummaryResponse>builder()
                .content(content)
                .page(problemPage.getNumber())
                .size(problemPage.getSize())
                .totalElements(problemPage.getTotalElements())
                .totalPages(problemPage.getTotalPages())
                .last(problemPage.isLast())
                .build();
    }

    public DailyChallengeResponse getDailyChallenge(UUID currentUserId) {
        List<Problem> allProblems = problemRepository.findAll();
        if (allProblems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No problems found for daily challenge");
        }

        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        long epochDay = today.toEpochDay();
        int index = (int) Math.abs(epochDay % allProblems.size());
        Problem dailyProblem = allProblems.get(index);

        ProblemSummaryResponse summary = mapToSummary(dailyProblem);
        boolean solved = false;
        int userRating = 1200;

        if (currentUserId != null) {
            User user = userRepository.findById(currentUserId).orElse(null);
            if (user != null) {
                userRating = user.getRating();
            }

            long acCount = submissionRepository.countByUserIdAndProblemIdAndStatus(
                    currentUserId, dailyProblem.getId(), SubmissionStatus.ACCEPTED);
            solved = acCount > 0;
            if (solved) {
                summary.setUserStatus("SOLVED");
            } else {
                long totalCount = submissionRepository.countByUserIdAndProblemId(currentUserId, dailyProblem.getId());
                if (totalCount > 0) {
                    summary.setUserStatus("ATTEMPTED");
                }
            }

            boolean isBookmarked = bookmarkRepository.findByUserIdAndProblemId(currentUserId, dailyProblem.getId()).isPresent();
            summary.setIsBookmarked(isBookmarked);
        }

        int estimatedGain = solved ? 0 : ratingService.calculateRatingDelta(userRating, dailyProblem.getDifficulty());

        return DailyChallengeResponse.builder()
                .problem(summary)
                .date(today.toString())
                .solvedByCurrentUser(solved)
                .estimatedEloGain(estimatedGain)
                .build();
    }

    public Map<String, Object> getEstimatedEloGain(String slug, UUID currentUserId) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));

        int userRating = 1200;
        boolean alreadySolved = false;

        if (currentUserId != null) {
            User user = userRepository.findById(currentUserId).orElse(null);
            if (user != null) {
                userRating = user.getRating();
            } 

            long acCount = submissionRepository.countByUserIdAndProblemIdAndStatus(
                    currentUserId, problem.getId(), SubmissionStatus.ACCEPTED);
            alreadySolved = acCount > 0;
        }

        int estimatedDelta = alreadySolved ? 0 : ratingService.calculateRatingDelta(userRating, problem.getDifficulty());

        return Map.of(
                "estimatedDelta", estimatedDelta,
                "alreadySolved", alreadySolved,
                "userRating", userRating,
                "difficulty", problem.getDifficulty().name()
        );
    }

    public ProblemDetailResponse getProblemBySlug(String slug) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found with slug: " + slug));

        return mapToDetail(problem);
    }

    public List<String> getAllTags() {
        return problemRepository.findAllDistinctTags();
    }

    @Transactional
    public boolean toggleBookmark(String slug, UUID userId) {
        Problem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return bookmarkRepository.findByUserIdAndProblemId(userId, problem.getId())
                .map(bm -> {
                    bookmarkRepository.delete(bm);
                    return false;
                })
                .orElseGet(() -> {
                    ProblemBookmark bm = new ProblemBookmark();
                    bm.setUser(user);
                    bm.setProblem(problem);
                    bookmarkRepository.save(bm);
                    return true;
                });
    }

    public List<ProblemSummaryResponse> getBookmarkedProblems(UUID userId) {
        List<ProblemBookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return bookmarks.stream()
                .map(b -> {
                    ProblemSummaryResponse resp = mapToSummary(b.getProblem());
                    resp.setIsBookmarked(true);
                    return resp;
                })
                .toList();
    }

    private ProblemSummaryResponse mapToSummary(Problem problem) {
        return ProblemSummaryResponse.builder()
                .id(problem.getId())
                .slug(problem.getSlug())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .acceptanceRate(problem.getAcceptanceRate())
                .timeLimitMs(problem.getTimeLimitMs())
                .memoryLimitMb(problem.getMemoryLimitMb())
                .tags(problem.getTags() != null ? Set.copyOf(problem.getTags()) : Set.of())
                .createdAt(problem.getCreatedAt())
                .userStatus("UNATTEMPTED")
                .isBookmarked(false)
                .build();
    }

    private ProblemDetailResponse mapToDetail(Problem problem) {
        List<TestCaseResponse> visibleTestCases = problem.getTestCases().stream()
                .filter(tc -> tc.isVisible())
                .map(tc -> TestCaseResponse.builder()
                        .id(tc.getId())
                        .inputData(tc.getInputData())
                        .expectedOutput(tc.getExpectedOutput())
                        .displayOrder(tc.getDisplayOrder())
                        .build())
                .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                .toList();

        return ProblemDetailResponse.builder()
                .id(problem.getId())
                .slug(problem.getSlug())
                .title(problem.getTitle())
                .difficulty(problem.getDifficulty())
                .description(problem.getDescription())
                .inputFormat(problem.getInputFormat())
                .outputFormat(problem.getOutputFormat())
                .constraints(problem.getConstraints())
                .examplesJson(problem.getExamplesJson())
                .sampleInput(problem.getSampleInput())
                .sampleOutput(problem.getSampleOutput())
                .acceptanceRate(problem.getAcceptanceRate())
                .timeLimitMs(problem.getTimeLimitMs())
                .memoryLimitMb(problem.getMemoryLimitMb())
                .tags(problem.getTags() != null ? Set.copyOf(problem.getTags()) : Set.of())
                .visibleTestCases(visibleTestCases)
                .createdAt(problem.getCreatedAt())
                .build();
    }

    private String getValidSortField(String sortBy) {
        if (sortBy == null) return "title";
        return switch (sortBy) {
            case "difficulty" -> "difficulty";
            case "acceptanceRate" -> "acceptanceRate";
            case "createdAt" -> "createdAt";
            default -> "title";
        };
    }
}
