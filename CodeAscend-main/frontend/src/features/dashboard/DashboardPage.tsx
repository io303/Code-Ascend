import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchDashboard } from "@/lib/api/dashboard";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorCard } from "@/components/ui/FeedbackComponents";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { DailyChallengeCard } from "@/components/ui/DailyChallengeCard";
import { ActivityHeatmap } from "@/components/ui/ActivityHeatmap";
import { RoadToNextTier } from "@/components/ui/RoadToNextTier";
import { useAuthStore } from "@/stores/auth-store";
import {
  Flame,
  Trophy,
  CheckCircle2,
  Code2,
  TrendingUp,
  Target,
  ArrowRight,
  Star
} from "lucide-react";

function getGreetingTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorCard message="Failed to load dashboard statistics." onRetry={refetch} />;
  }

  const greeting = getGreetingTime();
  const displayName = user?.displayName || "Coder";

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-fade-in font-sans">
      {/* Personalized Greeting Banner */}
      <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white p-6 sm:p-8 shadow-purple-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-mono font-bold text-amber-800 select-none cursor-default">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{data.streak} Day Coding Streak</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-arena-purple-light bg-arena-surface-purple px-3 py-1 text-xs font-mono font-bold text-arena-purple select-none cursor-default">
              <Trophy className="h-3.5 w-3.5" />
              <span>Elo Rating: {data.currentRating}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-arena-text tracking-tight">
            {greeting}, <span className="text-arena-purple">{displayName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-arena-text-secondary max-w-xl leading-relaxed">
            Your algorithm solver command center. Track submission statistics, maintain daily coding momentum, and master new topic patterns.
          </p>
        </div>

        <Link
          to="/problems"
          className="px-6 py-3.5 rounded-2xl bg-arena-purple text-white font-heading font-extrabold text-xs sm:text-sm hover:bg-arena-purple-hover transition-all shadow-purple flex items-center gap-2 shrink-0"
        >
          <span>Solve Challenges</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Road to Next Rank Tier Widget */}
      <RoadToNextTier currentRating={data.currentRating} />

      {/* Feature 2: Problem of the Day */}
      <DailyChallengeCard />

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Problems Solved */}
        <div className="rounded-3xl border border-arena-border bg-white p-5 shadow-card space-y-2 hover:border-arena-purple/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-arena-text-secondary">Problems Solved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-3xl font-heading font-extrabold text-arena-text">{data.problemsSolved}</span>
            <span className="text-xs text-emerald-700 font-bold">Accepted</span>
          </div>
        </div>

        {/* Current Rating */}
        <div className="rounded-3xl border border-arena-border bg-white p-5 shadow-card space-y-2 hover:border-arena-purple/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-arena-text-secondary">Current Rating</span>
            <Trophy className="h-4 w-4 text-arena-purple" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-3xl font-heading font-extrabold text-arena-purple">{data.currentRating}</span>
            <span className="text-xs text-arena-purple font-bold">Elo Rank</span>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="rounded-3xl border border-arena-border bg-white p-5 shadow-card space-y-2 hover:border-arena-purple/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-arena-text-secondary">Submissions</span>
            <Code2 className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-3xl font-heading font-extrabold text-arena-text">{data.totalSubmissions}</span>
            <span className="text-xs text-arena-text-secondary">Total Runs</span>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="rounded-3xl border border-arena-border bg-white p-5 shadow-card space-y-2 hover:border-arena-purple/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-arena-text-secondary">Acceptance Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className="text-3xl font-heading font-extrabold text-emerald-700">{data.acceptanceRate}%</span>
            <span className="text-xs text-emerald-700 font-bold">Accuracy</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Activity Breakdown & Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Difficulty Breakdown, Heatmap, and Submissions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Difficulty Breakdown */}
          <div className="rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-heading font-bold text-arena-text flex items-center gap-2">
                <Target className="h-4 w-4 text-arena-purple" />
                <span>Difficulty Progression</span>
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-700">EASY</span>
                <p className="text-2xl font-bold text-arena-text">{data.difficultyBreakdown?.EASY ?? 0}</p>
              </div>
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 text-center space-y-1">
                <span className="text-xs font-bold text-amber-700">MEDIUM</span>
                <p className="text-2xl font-bold text-arena-text">{data.difficultyBreakdown?.MEDIUM ?? 0}</p>
              </div>
              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50 text-center space-y-1">
                <span className="text-xs font-bold text-purple-700">HARD</span>
                <p className="text-2xl font-bold text-arena-text">{data.difficultyBreakdown?.HARD ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Feature 9: 365-Day Activity Heatmap */}
          <ActivityHeatmap submissionHeatmap={data.submissionHeatmap} />

          {/* Recent Submissions */}
          <div className="rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-heading font-bold text-arena-text font-sans">Recent Submissions</h2>
              <Link to="/submissions" className="text-xs font-bold text-arena-purple hover:underline">
                View All →
              </Link>
            </div>

            {!data.recentSubmissions || data.recentSubmissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-arena-text-secondary rounded-2xl border border-arena-border bg-arena-surface-subtle space-y-1">
                <p className="text-arena-text font-bold font-sans">Your arena is quiet.</p>
                <p>Solve your first problem to begin building your Code DNA.</p>
              </div>
            ) : (
              <div className="divide-y divide-arena-border">
                {data.recentSubmissions.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/submissions/${sub.id}`}
                    className="py-3 flex items-center justify-between text-xs hover:bg-arena-surface-purple p-2 rounded-xl transition-all"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-arena-text hover:text-arena-purple transition-colors font-sans text-sm block">
                        {sub.problemTitle}
                      </span>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={sub.status} />
                        <span className="text-arena-text-secondary">{sub.language}</span>
                      </div>
                    </div>
                    <span className="text-arena-text-secondary">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (4 cols): Leaderboard Preview & Recommended */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Competitors */}
          <div className="rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-heading font-bold text-arena-text font-sans flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>Top Competitors</span>
              </h2>
              <Link to="/leaderboard" className="text-xs font-bold text-arena-purple hover:underline">
                Leaderboard →
              </Link>
            </div>

            <div className="space-y-2.5">
              {data.leaderboardPreview?.slice(0, 5).map((u) => (
                <Link
                  key={u.userId}
                  to={`/profile/${u.username}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-arena-surface-subtle border border-arena-border hover:border-arena-purple-light hover:bg-arena-surface-purple transition-all text-xs group"
                >
                  <div className="flex items-center gap-3 font-sans">
                    <span className="font-mono font-bold text-arena-purple w-5 text-center">#{u.rank}</span>
                    <div>
                      <p className="font-bold text-arena-text group-hover:text-arena-purple transition-colors">{u.displayName}</p>
                      <p className="text-[10px] text-arena-text-secondary font-mono">@{u.username}</p>
                    </div>
                  </div>
                  <span className="font-bold text-arena-text">{u.rating} Elo</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recommended Problems */}
          <div className="rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-heading font-bold text-arena-text flex items-center gap-2">
              <Star className="h-4 w-4 text-arena-purple" />
              <span>Recommended Problems</span>
            </h2>
            <div className="space-y-2.5 font-mono text-xs">
              {data.recommendedProblems?.map((prob) => (
                <Link
                  key={prob.id}
                  to={`/problems/${prob.slug}`}
                  className="block p-3.5 rounded-2xl border border-arena-border bg-arena-surface-subtle hover:border-arena-purple-light hover:bg-arena-surface-purple transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-arena-text group-hover:text-arena-purple transition-colors font-sans">
                      {prob.title}
                    </span>
                    <DifficultyBadge difficulty={prob.difficulty} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
