package com.codearenaai.analytics.controller;

import com.codearenaai.analytics.dto.PlatformAnalyticsResponse;
import com.codearenaai.analytics.dto.UserAnalyticsResponse;
import com.codearenaai.analytics.service.AnalyticsService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<PlatformAnalyticsResponse> getPlatformAnalytics() {
        return ResponseEntity.ok(analyticsService.getPlatformAnalytics());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserAnalyticsResponse> getUserAnalytics(@PathVariable UUID userId) {
        return ResponseEntity.ok(analyticsService.getUserAnalytics(userId));
    }
}
