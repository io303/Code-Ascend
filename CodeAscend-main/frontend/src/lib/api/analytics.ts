import { apiClient } from "./client";
import type { PlatformAnalytics, UserAnalytics } from "@/types";

export async function fetchPlatformAnalytics(): Promise<PlatformAnalytics> {
  const response = await apiClient.get<PlatformAnalytics>("/analytics/dashboard");
  return response.data;
}

export async function fetchUserAnalytics(userId: string): Promise<UserAnalytics> {
  const response = await apiClient.get<UserAnalytics>(`/analytics/user/${userId}`);
  return response.data;
}
