package com.codearenaai.problem.controller;

import com.codearenaai.common.dto.PagedResponse;
import com.codearenaai.problem.dto.DailyChallengeResponse;
import com.codearenaai.problem.dto.ProblemDetailResponse;
import com.codearenaai.problem.dto.ProblemSummaryResponse;
import com.codearenaai.problem.model.ProblemDifficulty;
import com.codearenaai.problem.service.ProblemService;
import com.codearenaai.security.UserPrincipal;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ResponseEntity<PagedResponse<ProblemSummaryResponse>> getProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ProblemDifficulty difficulty,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PagedResponse<ProblemSummaryResponse> response = problemService.getProblems(
                page, size, search, difficulty, tag, sortBy, sortOrder,
                principal != null ? principal.getId() : null
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/daily-challenge")
    public ResponseEntity<DailyChallengeResponse> getDailyChallenge(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(problemService.getDailyChallenge(principal != null ? principal.getId() : null));
    }

    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        return ResponseEntity.ok(problemService.getAllTags());
    }

    @GetMapping("/bookmarked")
    public ResponseEntity<List<ProblemSummaryResponse>> getBookmarkedProblems(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(problemService.getBookmarkedProblems(principal.getId()));
    }

    @PostMapping("/{slug}/bookmark")
    public ResponseEntity<Map<String, Boolean>> toggleBookmark(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        boolean isBookmarked = problemService.toggleBookmark(slug, principal.getId());
        return ResponseEntity.ok(Map.of("bookmarked", isBookmarked));
    }

    @GetMapping("/{slug}/estimated-elo")
    public ResponseEntity<Map<String, Object>> getEstimatedEloGain(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(problemService.getEstimatedEloGain(slug, principal != null ? principal.getId() : null));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProblemDetailResponse> getProblemBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(problemService.getProblemBySlug(slug));
    }
}
