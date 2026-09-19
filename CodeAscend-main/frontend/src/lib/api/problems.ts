import { apiClient } from "./client";
import type { PagedResponse, ProblemDetail, ProblemSummary } from "@/types";

export interface DailyChallengeData {
  problem: ProblemSummary;
  date: string;
  solvedByCurrentUser: boolean;
  estimatedEloGain: number;
}

export interface EstimatedEloData {
  estimatedDelta: number;
  alreadySolved: boolean;
  userRating: number;
  difficulty: string;
}

export async function fetchProblems(params?: {
  page?: number;
  size?: number;
  search?: string;
  difficulty?: string;
  tag?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<PagedResponse<ProblemSummary>> {
  const response = await apiClient.get<PagedResponse<ProblemSummary>>("/problems", { params });
  return response.data;
}

export async function fetchDailyChallenge(): Promise<DailyChallengeData> {
  const response = await apiClient.get<DailyChallengeData>("/problems/daily-challenge");
  return response.data;
}

export async function fetchEstimatedElo(slug: string): Promise<EstimatedEloData> {
  const response = await apiClient.get<EstimatedEloData>(`/problems/${slug}/estimated-elo`);
  return response.data;
}

export async function fetchProblemBySlug(slug: string): Promise<ProblemDetail> {
  const response = await apiClient.get<ProblemDetail>(`/problems/${slug}`);
  return response.data;
}

export async function fetchAllTags(): Promise<string[]> {
  const response = await apiClient.get<string[]>("/problems/tags");
  return response.data;
}

export async function toggleBookmark(slug: string): Promise<{ bookmarked: boolean }> {
  const response = await apiClient.post<{ bookmarked: boolean }>(`/problems/${slug}/bookmark`);
  return response.data;
}

export async function fetchBookmarkedProblems(): Promise<ProblemSummary[]> {
  const response = await apiClient.get<ProblemSummary[]>("/problems/bookmarked");
  return response.data;
}
