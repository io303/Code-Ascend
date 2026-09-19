package com.codearenaai.leaderboard.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryResponse {
    private long rank;
    private UUID userId;
    private String username;
    private String displayName;
    private int rating;
    private long solvedCount;
    private int streak;
    private String tier;
}
