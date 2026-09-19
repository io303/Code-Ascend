import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth-store";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CodeDnaCard } from "@/components/ui/CodeDnaCard";
import { ActivityHeatmap } from "@/components/ui/ActivityHeatmap";
import { ErrorCard } from "@/components/ui/FeedbackComponents";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { RatingHistoryPoint } from "@/types";
import { Flame, Award, Code2, TrendingUp, Sparkles, ArrowRight, Shield } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

export function ProfilePage() {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const authUser = useAuthStore((s) => s.user);
  const targetUsername = paramUsername || authUser?.username;

  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-profile", targetUsername],
    queryFn: () => fetchUserProfile(targetUsername!),
    enabled: !!targetUsername,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <ErrorCard message="User profile not found." onRetry={refetch} />
      </div>
    );
  }

  const ratingChartData = (profile.ratingHistory && profile.ratingHistory.length > 0)
    ? profile.ratingHistory.map((rh: RatingHistoryPoint, idx: number) => ({
        index: idx + 1,
        date: new Date(rh.createdAt).toLocaleDateString(),
        rating: rh.newRating,
        prevRating: rh.previousRating,
        delta: rh.ratingDelta,
        problem: rh.reason || "Algorithm Solve",
      }))
    : [{ index: 1, date: "Start", rating: 1200, prevRating: 1200, delta: 0, problem: "Initial Rating" }];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white p-6 sm:p-8 shadow-purple-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-arena-purple text-white font-heading text-3xl font-extrabold flex items-center justify-center shadow-purple">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-extrabold text-arena-text">{profile.displayName}</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-arena-surface-purple text-arena-purple border border-arena-purple-light">
                {profile.tier}
              </span>
            </div>
            <p className="text-xs font-mono text-arena-text-secondary">@{profile.username} • {profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-arena-border pt-4 md:pt-0 md:pl-6 text-center">
          <div>
            <span className="text-[11px] text-arena-text-secondary block uppercase font-semibold">Global Rank</span>
            <span className="font-heading font-extrabold text-2xl text-amber-500">#{profile.rank}</span>
          </div>
          <div>
            <span className="text-[11px] text-arena-text-secondary block uppercase font-semibold">Elo Rating</span>
            <span className="font-heading font-extrabold text-2xl text-arena-purple">{profile.rating}</span>
          </div>
          <div>
            <span className="text-[11px] text-arena-text-secondary block uppercase font-semibold">Streak</span>
            <span className="font-heading font-extrabold text-2xl text-amber-700 flex items-center justify-center gap-1">
              <span>{profile.streak}</span>
              <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-card space-y-1">
          <span className="text-xs font-semibold text-arena-text-secondary uppercase">Problems Solved</span>
          <p className="text-3xl font-heading font-extrabold text-emerald-700">{profile.problemsSolved}</p>
        </div>
        <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-card space-y-1">
          <span className="text-xs font-semibold text-arena-text-secondary uppercase">Total Submissions</span>
          <p className="text-3xl font-heading font-extrabold text-arena-text">{profile.totalSubmissions}</p>
        </div>
        <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-card space-y-1">
          <span className="text-xs font-semibold text-arena-text-secondary uppercase">Acceptance Rate</span>
          <p className="text-3xl font-heading font-extrabold text-amber-700">{profile.acceptanceRate}%</p>
        </div>
        <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-card space-y-1">
          <span className="text-xs font-semibold text-arena-text-secondary uppercase">Competitive Tier</span>
          <p className="text-3xl font-heading font-extrabold text-arena-purple">{profile.tier}</p>
        </div>
      </div>

      {/* Code DNA Radar & Real Elo Rating Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code DNA Profile */}
        <div className="lg:col-span-6">
          <CodeDnaCard dna={profile.codeDna} />
        </div>

        {/* Real Elo Progression Chart */}
        <div className="lg:col-span-6 rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-bold text-arena-text flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-arena-purple" />
              <span>Elo Rating History & Milestones</span>
            </h2>
            <span className="text-xs font-mono text-arena-text-secondary">Persisted DB Events</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingChartData}>
                <XAxis dataKey="date" stroke="#5F5F6B" fontSize={11} tickLine={false} />
                <YAxis stroke="#5F5F6B" fontSize={11} tickLine={false} domain={[1150, "dataMax + 100"]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3.5 rounded-2xl border border-arena-purple-light bg-white shadow-card font-mono text-xs space-y-1">
                          <p className="text-arena-text font-bold">{data.problem}</p>
                          <p className="text-arena-text-secondary text-[11px]">{data.date}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-arena-purple font-bold">
                              {data.prevRating} → {data.rating}
                            </span>
                            <span className="text-emerald-700 font-bold">
                              (+{data.delta} Elo)
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={1200} stroke="#E5E2EA" strokeDasharray="3 3" label={{ value: "1200 Base", fill: "#5F5F6B", fontSize: 10 }} />
                <ReferenceLine y={1400} stroke="#E5E2EA" strokeDasharray="3 3" label={{ value: "1400 Competitor", fill: "#5F5F6B", fontSize: 10 }} />
                <ReferenceLine y={1600} stroke="#E5E2EA" strokeDasharray="3 3" label={{ value: "1600 Master", fill: "#5F5F6B", fontSize: 10 }} />
                <Line type="monotone" dataKey="rating" stroke="#8B3DFF" strokeWidth={3} dot={{ fill: "#8B3DFF", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Heatmap Section */}
      <ActivityHeatmap submissionHeatmap={profile.submissionHeatmap} />

      {/* Two Column Section: Achievements & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Achievements */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-heading font-bold text-arena-text flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Achievements & Badges</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.achievements.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    badge.unlocked
                      ? "border-arena-purple-light bg-arena-surface-purple"
                      : "border-arena-border bg-arena-surface-subtle opacity-50"
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-arena-text">{badge.title}</h4>
                    <p className="text-[11px] text-arena-text-secondary leading-tight mt-0.5">{badge.description}</p>
                    <span className={`text-[10px] font-semibold block mt-1 ${badge.unlocked ? "text-emerald-700 font-bold" : "text-arena-text-secondary"}`}>
                      {badge.unlocked ? "✓ Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Submissions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4">
            <h2 className="text-base font-heading font-bold text-arena-text flex items-center gap-2">
              <Code2 className="h-4 w-4 text-arena-purple" />
              <span>Solving Journey History</span>
            </h2>
            {profile.recentSubmissions.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-arena-text-secondary rounded-2xl border border-arena-border bg-arena-surface-subtle space-y-2">
                <Shield className="h-8 w-8 text-arena-muted mx-auto" />
                <p className="text-arena-text font-bold">Your arena is quiet.</p>
                <p>Solve your first problem to begin building your Code DNA.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {profile.recentSubmissions.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/submissions/${sub.id}`}
                    className="p-3.5 rounded-xl border border-arena-border bg-arena-surface-subtle hover:bg-arena-surface-purple transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={sub.status} />
                        <span className="text-xs font-semibold text-arena-text group-hover:text-arena-purple transition-colors">{sub.problemTitle}</span>
                      </div>
                      <span className="text-[11px] text-arena-text-secondary font-mono">{sub.language} • {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-right text-xs font-mono text-arena-text-secondary">
                      <p className="text-arena-text font-bold">{sub.runtimeMs != null ? `${sub.runtimeMs}ms` : "-"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
