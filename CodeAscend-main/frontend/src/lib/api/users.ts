import { apiClient } from "./client";
import type { UserProfile } from "@/types";

export type { UserProfile, AchievementBadge } from "@/types";

export async function fetchUserProfile(username: string): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>(`/users/profile/${username}`);
  return response.data;
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/users/profile/me");
  return response.data;
}
