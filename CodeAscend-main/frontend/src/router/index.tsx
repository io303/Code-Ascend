import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { RouteErrorBoundary } from "@/components/ui/RouteErrorBoundary";
import { AuthLanding } from "@/features/auth/AuthLanding";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ProblemsPage } from "@/features/problems/ProblemsPage";
import { ProblemWorkspacePage } from "@/features/problems/ProblemWorkspacePage";
import { SubmissionsPage } from "@/features/submissions/SubmissionsPage";
import { LeaderboardPage } from "@/features/leaderboard/LeaderboardPage";
import { AnalyticsPage } from "@/features/analytics/AnalyticsPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { LandingPage } from "@/features/landing/LandingPage";
import { HowItWorksPage } from "@/features/landing/HowItWorksPage";

function AppShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "how-it-works",
    element: <HowItWorksPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "auth",
    element: <AuthLanding />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "auth/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "auth/register",
    element: <RegisterPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppShellLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "problems",
            element: <ProblemsPage />,
          },
          {
            path: "problems/:slug",
            element: <ProblemWorkspacePage />,
          },
          {
            path: "submissions",
            element: <SubmissionsPage />,
          },
          {
            path: "leaderboard",
            element: <LeaderboardPage />,
          },
          {
            path: "analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "users/:username",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
