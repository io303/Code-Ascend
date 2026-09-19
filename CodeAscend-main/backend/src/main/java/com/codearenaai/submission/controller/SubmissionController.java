package com.codearenaai.submission.controller;

import com.codearenaai.common.dto.PagedResponse;
import com.codearenaai.security.UserPrincipal;
import com.codearenaai.submission.dto.CreateRunCodeRequest;
import com.codearenaai.submission.dto.CreateSubmissionRequest;
import com.codearenaai.submission.dto.RunCodeResponse;
import com.codearenaai.submission.dto.SubmissionDetailResponse;
import com.codearenaai.submission.dto.SubmissionResponse;
import com.codearenaai.submission.service.SubmissionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<SubmissionDetailResponse> createSubmission(
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        SubmissionDetailResponse response = submissionService.createSubmission(request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/run")
    public ResponseEntity<RunCodeResponse> runCode(
            @Valid @RequestBody CreateRunCodeRequest request
    ) {
        return ResponseEntity.ok(submissionService.runCode(request));
    }

    @GetMapping("/my")
    public ResponseEntity<PagedResponse<SubmissionResponse>> getMySubmissions(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(submissionService.getMySubmissions(principal.getId(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionDetailResponse> getSubmissionById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id, principal.getId()));
    }

    @GetMapping("/problem/{slug}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByProblem(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(submissionService.getSubmissionsByProblem(slug, principal.getId()));
    }

    @PostMapping("/{id}/hint")
    public ResponseEntity<Map<String, String>> requestHint(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String hint = submissionService.requestHint(id, principal.getId());
        return ResponseEntity.ok(Map.of("hint", hint));
    }
}
