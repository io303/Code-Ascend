import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/lib/api/leaderboard";
import { Trophy, Flame } from "lucide-react";
import { Link } from "react-router-dom";

export function LeaderboardRealSection() {
  const { data: leaderboardData, isLoading, isError } = useQuery({
    queryKey: ["public-leaderboard-preview"],
    queryFn: () => fetchLeaderboard(0, 5),
  });

  const users = leaderboardData?.content ?? [];

  return (
    <section id="leaderboard" className="py-16 sm:py-20 px-6 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto space-y-10 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-xs font-mono font-bold text-amber-800 select-none cursor-default">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Live Competitor Rankings</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-arena-text tracking-tight">
            YOUR PROGRESS HAS A RANK.
          </h2>
          <p className="text-sm text-arena-text-secondary">
            Real competitive rankings derived from persisted Elo history and verified problem solves.
          </p>
        </div>

        {/* Leaderboard Table Container */}
        <div className="w-full max-w-4xl mx-auto rounded-3xl border border-arena-border bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-arena-border pb-3 text-xs font-mono text-arena-text-secondary">
            <span>Competitor</span>
            <div className="flex items-center gap-8">
              <span>Solved</span>
              <span>Streak</span>
              <span>Elo Rating</span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-arena-text-secondary font-mono animate-pulse">
              Loading live arena rankings...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-xs text-arena-text-secondary font-mono">
              Leaderboard unavailable
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-xs text-arena-text-secondary font-mono">
              No competitors ranked yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {users.map((u, idx) => (
                <div
                  key={u.userId}
                  className="p-4 rounded-2xl border border-arena-border bg-arena-surface-subtle hover:bg-arena-surface-purple transition-all flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-7 text-center font-bold text-sm ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-500" : idx === 2 ? "text-amber-700" : "text-arena-text-secondary"}`}>
                      #{u.rank}
                    </span>
                    <div className="h-9 w-9 rounded-xl bg-arena-purple text-white font-bold flex items-center justify-center shadow-purple-sm">
                      {u.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left font-sans">
                      <Link to={`/profile/${u.username}`} className="font-bold text-arena-text hover:text-arena-purple transition-colors block">
                        {u.displayName}
                      </Link>
                      <span className="text-[11px] text-arena-text-secondary font-mono">@{u.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <span className="text-emerald-700 font-bold">{u.solvedCount} AC</span>
                    <span className="text-amber-700 flex items-center gap-1 font-bold">
                      {u.streak} <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    </span>
                    <span className="px-3 py-1 rounded-full bg-arena-surface-purple text-arena-purple border border-arena-purple-light font-bold text-xs">
                      {u.rating} Elo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 text-center">
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-arena-purple hover:text-arena-purple-hover transition-colors"
            >
              <span>View Full Global Leaderboard</span>
              <Trophy className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
