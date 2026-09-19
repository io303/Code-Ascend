import { apiClient } from "./client";
import type { DashboardData } from "@/types";

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await apiClient.get<DashboardData>("/dashboard");
  return response.data;
}
