import { apiClient } from "./client";
import type { LeaderboardEntry, PagedResponse, UserRank } from "@/types";

export async function fetchLeaderboard(page = 0, size = 20): Promise<PagedResponse<LeaderboardEntry>> {
  const response = await apiClient.get<PagedResponse<LeaderboardEntry>>("/leaderboard", {
    params: { page, size },
  });
  return response.data;
}

export async function fetchMyRank(): Promise<UserRank> {
  const response = await apiClient.get<UserRank>("/leaderboard/me");
  return response.data;
}
