import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";

export function ProtectedRoute() {
  const location = useLocation();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return (
      <section className="rounded-3xl border border-arena-border bg-arena-surface p-8 shadow-card space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-arena-orange">
          Restoring Session
        </p>
        <h2 className="text-xl font-heading font-bold text-white">
          Checking authentication state...
        </h2>
        <p className="text-xs text-arena-muted">
          Loading local session before resolving protected route access.
        </p>
      </section>
    );
  }

  if (!isAuthenticated) {
    const redirectTarget = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(redirectTarget)}`}
        replace
        state={{ from: redirectTarget }}
      />
    );
  }

  return <Outlet />;
}
