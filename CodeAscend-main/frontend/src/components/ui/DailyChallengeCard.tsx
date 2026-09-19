import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchDailyChallenge } from "@/lib/api/problems";
import { Sparkles, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import { CardSkeleton } from "./Skeleton";

export function DailyChallengeCard() {
  const { data: daily, isLoading, isError } = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: fetchDailyChallenge,
  });

  if (isLoading) return <CardSkeleton />;
  if (isError || !daily || !daily.problem) return null;

  const problem = daily.problem;

  return (
    <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white p-6 sm:p-8 shadow-purple-sm relative overflow-hidden font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
              <Sparkles className="h-3.5 w-3.5 text-arena-purple" /> DAILY CHALLENGE • {daily.date}
            </span>

            {daily.solvedByCurrentUser ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200 select-none cursor-default">
                <CheckCircle2 className="h-3.5 w-3.5" /> SOLVED TODAY
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-mono font-bold border border-amber-200 select-none cursor-default">
                <Trophy className="h-3.5 w-3.5" /> +{daily.estimatedEloGain} Potential Elo
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-arena-text">
            {problem.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-lg font-bold border ${
              problem.difficulty === "EASY"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : problem.difficulty === "MEDIUM"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-purple-50 text-purple-700 border-purple-200"
            }`}>
              {problem.difficulty}
            </span>

            {problem.tags && Array.from(problem.tags).map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-white border border-arena-border text-arena-text-secondary">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/problems/${problem.slug}`}
          className="px-6 py-3.5 rounded-2xl bg-arena-purple text-white font-heading font-extrabold text-xs sm:text-sm hover:bg-arena-purple-hover shadow-purple flex items-center gap-2 shrink-0 transition-all transform hover:-translate-y-0.5"
        >
          <span>Solve Challenge</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
