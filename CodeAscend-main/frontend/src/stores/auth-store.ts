import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const AUTH_STORAGE_KEY = "codeascend.auth";

export type AuthUser = {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setSession: (session: {
    accessToken: string;
    user: AuthUser;
  }) => void;
  clearSession: () => void;
  finishHydration: () => void;
};

const initialSessionState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialSessionState,
      hasHydrated: false,
      setSession: ({ accessToken, user }) =>
        set({
          accessToken,
          user,
          isAuthenticated: true,
          hasHydrated: true,
        }),
      clearSession: () =>
        set({
          ...initialSessionState,
          hasHydrated: true,
        }),
      finishHydration: () =>
        set((state) => {
          const isAuth = Boolean(state.accessToken);
          if (state.hasHydrated && state.isAuthenticated === isAuth) {
            return state;
          }
          return {
            hasHydrated: true,
            isAuthenticated: isAuth,
          };
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken, user }) => ({
        accessToken,
        user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.finishHydration();
      },
    },
  ),
);

export function clearAuthSession() {
  useAuthStore.getState().clearSession();
}
