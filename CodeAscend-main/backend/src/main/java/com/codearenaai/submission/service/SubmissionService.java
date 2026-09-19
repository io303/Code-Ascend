package com.codearenaai.submission.service;

import com.codearenaai.ai.service.AIAgentService;
import com.codearenaai.common.dto.PagedResponse;
import com.codearenaai.problem.model.Problem;
import com.codearenaai.problem.repository.ProblemRepository;
import com.codearenaai.rating.model.RatingHistory;
import com.codearenaai.rating.repository.RatingHistoryRepository;
import com.codearenaai.submission.dto.CreateRunCodeRequest;
import com.codearenaai.submission.dto.CreateSubmissionRequest;
import com.codearenaai.submission.dto.RunCodeResponse;
import com.codearenaai.submission.dto.SubmissionDetailResponse;
import com.codearenaai.submission.dto.SubmissionResponse;
import com.codearenaai.submission.eval.CodeExecutionEvaluator;
import com.codearenaai.submission.event.SubmissionEvent;
import com.codearenaai.submission.kafka.SubmissionProducer;
import com.codearenaai.submission.model.Submission;
import com.codearenaai.submission.model.SubmissionStatus;
import com.codearenaai.submission.repository.SubmissionRepository;
import com.codearenaai.user.model.User;
import com.codearenaai.user.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final SubmissionProducer submissionProducer;
    private final CodeExecutionEvaluator evaluator;
    private final AIAgentService aiAgentService;
    private final RatingHistoryRepository ratingHistoryRepository;

    @Transactional
    public SubmissionDetailResponse createSubmission(CreateSubmissionRequest request, UUID userId) {
        Problem problem;
        if (request.getProblemId() != null) {
            problem = problemRepository.findById(request.getProblemId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found with ID: " + request.getProblemId()));
        } else if (request.getProblemSlug() != null && !request.getProblemSlug().isBlank()) {
            problem = problemRepository.findBySlug(request.getProblemSlug())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem not found with slug: " + request.getProblemSlug()));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Either problemId or problemSlug must be provided");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setLanguage(request.getLanguage());
        submission.setSourceCode(request.getSourceCode());
        submission.setStatus(SubmissionStatus.PENDING);
        submission.setQueueKey("sub-queue-1");
        submission.setQueuedAt(Instant.now());

        Submission saved = submissionRepository.save(submission);

        try {
            submissionProducer.publishSubmissionEvent(SubmissionEvent.builder()
                    .submissionId(saved.getId())
                    .userId(saved.getUser().getId())
                    .problemId(saved.getProblem().getId())
                    .language(saved.getLanguage().name())
                    .sourceCode(saved.getSourceCode())
                    .build());
        } catch (Exception e) {
            saved.setStatus(SubmissionStatus.RUNNING);
            submissionRepository.save(saved);
        }

        return mapToDetailResponse(saved);
    }

    public RunCodeResponse runCode(CreateRunCodeRequest request) {
        String stdin = request.getCustomInput();
        String expectedOutput = null;

        if (request.getProblemSlug() != null && !request.getProblemSlug().isBlank()) {
            var problemOpt = problemRepository.findBySlug(request.getProblemSlug());
            if (problemOpt.isPresent()) {
                Problem problem = problemOpt.get();
                String sampleIn = problem.getSampleInput();
                String sampleOut = problem.getSampleOutput();

                if (stdin == null || stdin.isBlank()) {
                    stdin = sampleIn != null ? sampleIn : "";
                    expectedOutput = sampleOut;
                } else if (sampleIn != null && stdin.trim().equals(sampleIn.trim())) {
                    expectedOutput = sampleOut;
                } else if (problem.getTestCases() != null) {
                    for (var tc : problem.getTestCases()) {
                        if (tc.getInputData() != null && stdin.trim().equals(tc.getInputData().trim())) {
                            expectedOutput = tc.getExpectedOutput();
                            break;
                        }
                    }
                }
            }
        }

        if (stdin == null) {
            stdin = "";
        }

        CodeExecutionEvaluator.CustomRunOutcome result = evaluator.runCustomCode(
                request.getSourceCode(),
                request.getLanguage(),
                stdin,
                expectedOutput,
                2000,
                256
        );

        return RunCodeResponse.builder()
                .status(result.status())
                .stdout(result.stdout())
                .runtimeMs(result.runtimeMs())
                .memoryKb(result.memoryKb())
                .failureMessage(result.failureMessage())
                .expectedOutput(result.expectedOutput())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<SubmissionResponse> getMySubmissions(UUID userId, int page, int size) {
        return getSubmissions(page, size, null, userId, null);
    }

    @Transactional(readOnly = true)
    public PagedResponse<SubmissionResponse> getSubmissions(
            int page,
            int size,
            UUID problemId,
            UUID userId,
            SubmissionStatus status
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        Page<Submission> submissionPage = submissionRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();
            if (problemId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("problem").get("id"), problemId));
            }
            if (userId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("user").get("id"), userId));
            }
            if (status != null) {
                predicates = cb.and(predicates, cb.equal(root.get("status"), status));
            }
            return predicates;
        }, pageable);

        List<SubmissionResponse> content = submissionPage.getContent().stream()
                .map(this::mapToSummaryResponse)
                .toList();

        return PagedResponse.<SubmissionResponse>builder()
                .content(content)
                .page(submissionPage.getNumber())
                .size(submissionPage.getSize())
                .totalElements(submissionPage.getTotalElements())
                .totalPages(submissionPage.getTotalPages())
                .last(submissionPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public SubmissionDetailResponse getSubmissionById(UUID submissionId, UUID currentUserId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found with ID: " + submissionId));

        return mapToDetailResponse(submission);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsByProblem(String slug, UUID userId) {
        List<Submission> submissions = submissionRepository.findByUserIdAndProblemSlugOrderBySubmittedAtDesc(userId, slug);
        return submissions.stream()
                .map(this::mapToSummaryResponse)
                .toList();
    }

    public String requestHint(UUID submissionId, UUID userId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        if (submission.getAiHint() != null && !submission.getAiHint().isBlank()) {
            return submission.getAiHint();
        }

        Problem problem = submission.getProblem();
        String hint = aiAgentService.generateHint(
                problem.getTitle(),
                problem.getDescription(),
                submission.getSourceCode(),
                submission.getLanguage().name()
        );

        submission.setAiHint(hint);
        submissionRepository.save(submission);

        return hint;
    }

    private SubmissionResponse mapToSummaryResponse(Submission s) {
        return SubmissionResponse.builder()
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
                .build();
    }

    private SubmissionDetailResponse mapToDetailResponse(Submission s) {
        Integer ratingDelta = ratingHistoryRepository.findBySubmissionId(s.getId())
                .map(RatingHistory::getRatingDelta)
                .orElse(0);

        int totalTestCases = (s.getProblem() != null && s.getProblem().getTestCases() != null && !s.getProblem().getTestCases().isEmpty())
                ? s.getProblem().getTestCases().size()
                : 4;
        int passedTestCases = (s.getStatus() == SubmissionStatus.ACCEPTED) ? totalTestCases : Math.max(0, totalTestCases - 1);

        return SubmissionDetailResponse.builder()
                .id(s.getId())
                .evaluationId(s.getEvaluationId())
                .problemId(s.getProblem().getId())
                .problemSlug(s.getProblem().getSlug())
                .problemTitle(s.getProblem().getTitle())
                .userId(s.getUser().getId())
                .username(s.getUser().getUsername())
                .language(s.getLanguage())
                .sourceCode(s.getSourceCode())
                .status(s.getStatus())
                .runtimeMs(s.getRuntimeMs())
                .memoryKb(s.getMemoryKb())
                .queueKey(s.getQueueKey())
                .queuedAt(s.getQueuedAt())
                .startedAt(s.getStartedAt())
                .completedAt(s.getCompletedAt())
                .failureMessage(s.getFailureMessage())
                .submittedAt(s.getSubmittedAt())
                .aiHint(s.getAiHint())
                .aiComplexityJson(s.getAiComplexityJson())
                .aiPlagiarismScore(s.getAiPlagiarismScore())
                .aiFeedback(s.getAiFeedback())
                .passedTestCasesCount(passedTestCases)
                .totalTestCasesCount(totalTestCases)
                .ratingDelta(ratingDelta)
                .build();
    }
}
