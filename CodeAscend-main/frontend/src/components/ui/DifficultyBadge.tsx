import type { ProblemDifficulty } from "@/types";

type Props = {
  difficulty: ProblemDifficulty;
  className?: string;
};

export function DifficultyBadge({ difficulty, className = "" }: Props) {
  const styles = {
    EASY: "bg-emerald-500/10 text-arena-accepted border-emerald-500/30",
    MEDIUM: "bg-amber-500/10 text-arena-medium border-amber-500/30",
    HARD: "bg-purple-500/10 text-arena-hard border-purple-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[difficulty]} ${className}`}
    >
      {difficulty}
    </span>
  );
}
