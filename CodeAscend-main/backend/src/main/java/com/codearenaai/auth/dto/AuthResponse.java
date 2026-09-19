package com.codearenaai.auth.dto;

import java.time.Instant;
import java.util.UUID;

public record AuthResponse(
        String accessToken,
        Instant expiresAt,
        UserPayload user
) {
    public record UserPayload(
            UUID userId,
            String username,
            String email,
            String displayName,
            String role
    ) {
    }
}
