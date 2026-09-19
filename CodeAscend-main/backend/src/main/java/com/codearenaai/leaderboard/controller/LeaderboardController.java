package com.codearenaai.leaderboard.controller;

import com.codearenaai.common.dto.PagedResponse;
import com.codearenaai.leaderboard.dto.LeaderboardEntryResponse;
import com.codearenaai.leaderboard.dto.UserRankResponse;
import com.codearenaai.leaderboard.service.LeaderboardService;
import com.codearenaai.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<PagedResponse<LeaderboardEntryResponse>> getLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(page, size));
    }

    @GetMapping("/me")
    public ResponseEntity<UserRankResponse> getMyRank(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(leaderboardService.getUserRank(principal.getId()));
    }
}
