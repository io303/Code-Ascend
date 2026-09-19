import { apiClient } from "@/lib/api/client";
import type { AuthUser } from "@/stores/auth-store";

export type AuthResponse = {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  displayName: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await apiClient.get<AuthResponse>("/auth/me");
  return response.data;
}
