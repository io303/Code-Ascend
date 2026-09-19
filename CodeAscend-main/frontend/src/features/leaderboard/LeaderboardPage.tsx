import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchLeaderboard, fetchMyRank } from "@/lib/api/leaderboard";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { Trophy, Flame, Search, UserCheck } from "lucide-react";

export function LeaderboardPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "TOP10" | "TOP50">("ALL");

  const { data: myRank } = useQuery({
    queryKey: ["my-rank"],
    queryFn: fetchMyRank,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["leaderboard", page],
    queryFn: () => fetchLeaderboard(page, 50),
  });

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "Grandmaster":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Master":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Candidate Master":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Specialist":
        return "bg-arena-surface-purple text-arena-purple border-arena-purple-light";
      case "Pupil":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-arena-surface-subtle text-arena-text-secondary border-arena-border";
    }
  };

  const rawList = data?.content ?? [];
  let displayList = rawList.filter((e) =>
    e.displayName.toLowerCase().includes(search.trim().toLowerCase()) ||
    e.username.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (filterMode === "TOP10") displayList = displayList.slice(0, 10);
  else if (filterMode === "TOP50") displayList = displayList.slice(0, 50);

  const top3 = rawList.slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white p-6 sm:p-8 shadow-purple-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-mono font-bold text-amber-800 select-none cursor-default">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Global Competitive Standings</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-arena-text tracking-tight">
            CodeAscend Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-arena-text-secondary max-w-2xl">
            Real competitive standings derived from persisted Elo history and verified problem solves.
          </p>
        </div>

        {myRank && (
          <Link
            to={`/profile/${myRank.username}`}
            className="p-4 rounded-2xl border border-arena-purple-light bg-arena-surface-purple flex items-center gap-4 text-xs shrink-0 shadow-purple-sm hover:border-arena-purple transition-all"
          >
            <div className="text-center font-mono">
              <span className="text-[10px] text-arena-text-secondary uppercase block">Your Rank</span>
              <span className="text-2xl font-bold text-arena-purple">#{myRank.rank}</span>
            </div>
            <div className="h-8 w-px bg-arena-purple-light" />
            <div className="space-y-0.5 font-mono">
              <p className="font-bold text-arena-text flex items-center gap-1.5">
                <span>{myRank.displayName}</span>
                <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              </p>
              <p className="text-arena-text-secondary text-[11px]">{myRank.rating} Elo · {myRank.solvedCount} Solved</p>
            </div>
          </Link>
        )}
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length >= 3 && page === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* #2 Silver */}
          <div className="rounded-3xl border border-slate-300 bg-white p-5 text-center space-y-3 shadow-card order-2 md:order-1">
            <div className="h-10 w-10 mx-auto rounded-full bg-slate-100 text-slate-700 font-bold text-lg flex items-center justify-center border border-slate-300">
              🥈
            </div>
            <div>
              <Link to={`/profile/${top3[1].username}`} className="font-heading font-bold text-arena-text text-base hover:text-arena-purple transition-colors">
                {top3[1].displayName}
              </Link>
              <p className="text-xs text-arena-text-secondary font-mono">@{top3[1].username}</p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300">
              {top3[1].rating} Elo
            </span>
          </div>

          {/* #1 Gold */}
          <div className="rounded-3xl border border-amber-300 bg-gradient-to-b from-amber-50 via-white to-white p-6 text-center space-y-3 shadow-purple-sm order-1 md:order-2 md:-translate-y-2">
            <div className="h-12 w-12 mx-auto rounded-full bg-amber-100 text-amber-700 font-bold text-xl flex items-center justify-center border border-amber-300">
              🥇
            </div>
            <div>
              <Link to={`/profile/${top3[0].username}`} className="font-heading font-extrabold text-arena-text text-lg hover:text-arena-purple transition-colors">
                {top3[0].displayName}
              </Link>
              <p className="text-xs text-amber-700 font-mono">@{top3[0].username}</p>
            </div>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {top3[0].rating} Elo
            </span>
          </div>

          {/* #3 Bronze */}
          <div className="rounded-3xl border border-amber-200 bg-white p-5 text-center space-y-3 shadow-card order-3">
            <div className="h-10 w-10 mx-auto rounded-full bg-amber-50 text-amber-800 font-bold text-lg flex items-center justify-center border border-amber-200">
              🥉
            </div>
            <div>
              <Link to={`/profile/${top3[2].username}`} className="font-heading font-bold text-arena-text text-base hover:text-arena-purple transition-colors">
                {top3[2].displayName}
              </Link>
              <p className="text-xs text-arena-text-secondary font-mono">@{top3[2].username}</p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {top3[2].rating} Elo
            </span>
          </div>
        </div>
      )}

      {/* Filters & Search Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-arena-border bg-white font-mono text-xs shadow-card">
          <button
            type="button"
            onClick={() => setFilterMode("ALL")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === "ALL" ? "bg-arena-purple text-white shadow-purple-sm" : "text-arena-text-secondary hover:text-arena-text"
            }`}
          >
            Global
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("TOP10")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === "TOP10" ? "bg-arena-purple text-white shadow-purple-sm" : "text-arena-text-secondary hover:text-arena-text"
            }`}
          >
            Top 10
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("TOP50")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === "TOP50" ? "bg-arena-purple text-white shadow-purple-sm" : "text-arena-text-secondary hover:text-arena-text"
            }`}
          >
            Top 50
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-arena-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competitor username..."
            className="w-full rounded-2xl border border-arena-border bg-white pl-10 pr-4 py-2 text-xs text-arena-text placeholder-arena-muted focus:border-arena-purple focus:outline-none transition-all font-mono shadow-card"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl border border-arena-border bg-white overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-xs font-mono text-arena-text-secondary">
            Leaderboard failed to load. Please refresh.
          </div>
        ) : displayList.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-arena-text-secondary space-y-2">
            <Trophy className="h-10 w-10 text-arena-muted mx-auto" />
            <p className="text-arena-text font-bold text-sm">Be the first competitor on the board.</p>
            <p>Solve algorithm challenges to calculate your initial Elo rank.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-arena-text">
              <thead className="border-b border-arena-border bg-arena-surface-subtle uppercase tracking-wider text-arena-text-secondary">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">Rank</th>
                  <th className="px-6 py-4">Competitor</th>
                  <th className="px-6 py-4">Elo Rating</th>
                  <th className="px-6 py-4">Tier</th>
                  <th className="px-6 py-4">Problems Solved</th>
                  <th className="px-6 py-4 text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arena-border">
                {displayList.map((entry) => {
                  const isCurrentUser = myRank?.userId === entry.userId;
                  return (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-arena-surface-purple transition-colors ${
                        isCurrentUser ? "bg-arena-surface-purple border-l-4 border-l-arena-purple" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-center font-bold text-arena-purple text-sm">
                        #{entry.rank}
                      </td>
                      <td className="px-6 py-4 font-semibold text-arena-text whitespace-nowrap">
                        <Link to={`/profile/${entry.username}`} className="flex items-center gap-2 hover:text-arena-purple transition-colors">
                          <span className="font-bold text-sm">{entry.displayName}</span>
                          <span className="text-arena-text-secondary">@{entry.username}</span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-md bg-arena-purple text-white font-extrabold text-[10px]">
                              YOU
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-arena-text whitespace-nowrap">
                        {entry.rating} Elo
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${getTierStyle(entry.tier)}`}>
                          {entry.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-700 whitespace-nowrap">
                        {entry.solvedCount} AC
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-amber-700 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          {entry.streak} <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
