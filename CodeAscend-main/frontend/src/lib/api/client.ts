import axios from "axios";
import { clearAuthSession, useAuthStore } from "@/stores/auth-store";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const state = useAuthStore.getState();
      const hadToken = Boolean(state.accessToken);
      const requestUrl = error.config?.url ?? "";
      const isAuthEndpoint =
        requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

      if (!isAuthEndpoint) {
        if (hadToken) {
          clearAuthSession();
        }

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const isPublicPage = currentPath === "/" || currentPath.startsWith("/auth");

          // ONLY redirect to /auth/login if:
          // 1. A token actually existed AND
          // 2. The user is currently on a protected route (not a public page like /)
          if (hadToken && !isPublicPage) {
            const fullPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
            const redirectQuery = `reason=expired&redirect=${encodeURIComponent(fullPath)}`;
            window.location.replace(`/auth/login?${redirectQuery}`);
          }
        }
      }
    }

    return Promise.reject(error);
  },
);
