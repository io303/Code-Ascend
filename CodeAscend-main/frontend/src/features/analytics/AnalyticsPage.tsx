import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { fetchPlatformAnalytics } from "@/lib/api/analytics";
import { ErrorCard, Skeleton } from "@/components/ui/FeedbackComponents";
import { BarChart3, Users, Code2, CheckCircle2, Trophy, Sparkles } from "lucide-react";

const COLORS = ["#8B3DFF", "#9D4EDD", "#C084FC", "#10b981", "#f59e0b"];

export function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["platform-analytics"],
    queryFn: fetchPlatformAnalytics,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorCard message="Failed to load platform analytics." onRetry={refetch} />;
  }

  const submissionsByDayData = Object.entries(data.submissionsByDay ?? {}).map(([date, count]) => ({
    date: date.slice(5),
    submissions: count,
  }));

  const difficultyData = Object.entries(data.difficultyDistribution ?? {}).map(([difficulty, count]) => ({
    name: difficulty,
    count,
  }));

  const languageData = Object.entries(data.topLanguages ?? {}).map(([language, count]) => ({
    name: language,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white p-6 sm:p-8 shadow-purple-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-arena-purple-light bg-arena-surface-purple px-3.5 py-1 text-xs font-mono font-semibold text-arena-purple select-none cursor-default">
          <BarChart3 className="h-3.5 w-3.5 text-arena-purple" />
          <span>Real-Time Platform Insights</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-arena-text tracking-tight">
          Platform Analytics & Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-arena-text-secondary">
          Persisted metrics across submissions, problem difficulty distributions, and compiler runtime telemetry.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl border border-arena-border bg-white space-y-1 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-arena-text-secondary">Total Users</span>
            <Users className="h-4 w-4 text-arena-purple" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-arena-text">{data.totalUsers}</p>
        </div>

        <div className="p-5 rounded-2xl border border-arena-border bg-white space-y-1 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-arena-text-secondary">Submissions</span>
            <Code2 className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-arena-text">{data.totalSubmissions}</p>
        </div>

        <div className="p-5 rounded-2xl border border-arena-border bg-white space-y-1 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-arena-text-secondary">Problems</span>
            <Sparkles className="h-4 w-4 text-arena-purple" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-arena-text">{data.totalProblems}</p>
        </div>

        <div className="p-5 rounded-2xl border border-arena-border bg-white space-y-1 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-arena-text-secondary">Acceptance</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-emerald-700">{data.acceptanceRate}%</p>
        </div>

        <div className="p-5 rounded-2xl border border-arena-border bg-white space-y-1 shadow-card col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-arena-text-secondary">Avg Rating</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-3xl font-heading font-extrabold text-arena-purple">{data.averageUserRating}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Submissions Over Time */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-arena-border bg-white shadow-card space-y-4">
          <h2 className="text-base font-heading font-bold text-arena-text">Submissions Over Time (Past 30 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={submissionsByDayData}>
                <XAxis dataKey="date" stroke="#5F5F6B" fontSize={11} tickLine={false} />
                <YAxis stroke="#5F5F6B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E2EA", borderRadius: "12px", color: "#171717" }}
                />
                <Line type="monotone" dataKey="submissions" stroke="#8B3DFF" strokeWidth={3} dot={{ fill: "#8B3DFF", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Difficulty Distribution */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-arena-border bg-white shadow-card space-y-4">
          <h2 className="text-base font-heading font-bold text-arena-text">Difficulty Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={difficultyData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {difficultyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E2EA", borderRadius: "12px", color: "#171717" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Top Languages */}
        <div className="lg:col-span-12 p-6 rounded-2xl border border-arena-border bg-white shadow-card space-y-4">
          <h2 className="text-base font-heading font-bold text-arena-text">Submissions by Runtime Language</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageData}>
                <XAxis dataKey="name" stroke="#5F5F6B" fontSize={12} />
                <YAxis stroke="#5F5F6B" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E2EA", borderRadius: "12px", color: "#171717" }}
                />
                <Bar dataKey="count" fill="#8B3DFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
