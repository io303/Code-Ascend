import React from "react";
import { Bot, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

type AiCoachProps = {
  aiComplexityJson?: string | null;
  aiPlagiarismScore?: number | null;
  aiFeedback?: string | null;
  status: string;
  nextProblemSlug?: string;
  nextProblemTitle?: string;
};

export function AiPostSolveCoach({
  aiComplexityJson,
  aiPlagiarismScore,
  aiFeedback,
  status,
  nextProblemSlug,
  nextProblemTitle,
}: AiCoachProps) {
  const hasContent = aiComplexityJson || aiFeedback || aiPlagiarismScore != null;

  if (!hasContent) {
    return (
      <div className="p-4 rounded-2xl border border-arena-border bg-arena-bg/60 text-xs text-arena-muted space-y-1">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Bot className="h-4 w-4 text-purple-400" />
          <span>AI Post-Solve Coach</span>
        </div>
        <p>AI Assistant is currently unavailable or generating insights for this submission.</p>
      </div>
    );
  }

  let parsedComplexity: { timeComplexity?: string; spaceComplexity?: string; explanation?: string } = {};
  if (aiComplexityJson) {
    try {
      parsedComplexity = JSON.parse(aiComplexityJson);
    } catch {
      parsedComplexity = { timeComplexity: "O(N)", spaceComplexity: "O(1)" };
    }
  }

  return (
    <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-arena-surface to-arena-surface p-6 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-glow">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-white text-base">AI Post-Solve Coach</h3>
            <p className="text-[11px] text-arena-muted">Algorithmic quality & complexity breakdown</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <Sparkles className="h-3 w-3" />
          <span>Live Analysis</span>
        </span>
      </div>

      {/* Grid: Complexity & Originality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Complexity */}
        <div className="p-4 rounded-2xl border border-arena-border bg-arena-bg/80 space-y-1.5 font-mono">
          <span className="text-[10px] font-sans font-semibold text-purple-400 uppercase tracking-wider block">Time & Space Complexity</span>
          <div className="flex items-center justify-between text-white font-bold">
            <span>Time: {parsedComplexity.timeComplexity || "O(N)"}</span>
            <span>Space: {parsedComplexity.spaceComplexity || "O(1)"}</span>
          </div>
          {parsedComplexity.explanation && (
            <p className="text-[11px] font-sans text-arena-muted pt-1 border-t border-arena-border/50">
              {parsedComplexity.explanation}
            </p>
          )}
        </div>

        {/* Originality / Plagiarism */}
        <div className="p-4 rounded-2xl border border-arena-border bg-arena-bg/80 space-y-1.5">
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Code Originality</span>
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-white">Jaccard Score</span>
            <span className="text-emerald-400 font-bold">{100 - (aiPlagiarismScore ?? 0)}% Unique</span>
          </div>
          <p className="text-[11px] text-arena-muted">
            Code verified against stored solution tokens in database.
          </p>
        </div>
      </div>

      {/* Code Feedback */}
      {aiFeedback && (
        <div className="p-4 rounded-2xl border border-arena-border bg-arena-bg/80 space-y-1.5 text-xs">
          <span className="font-semibold text-arena-orange uppercase tracking-wider block">Quality Feedback</span>
          <p className="text-arena-text leading-relaxed whitespace-pre-line">{aiFeedback}</p>
        </div>
      )}

      {/* Recommended Next Problem */}
      {nextProblemSlug && (
        <div className="p-4 rounded-2xl border border-arena-orange/30 bg-arena-orange/10 flex items-center justify-between">
          <div className="space-y-0.5 text-xs">
            <span className="text-arena-orange font-semibold uppercase text-[10px]">Next Recommended Challenge</span>
            <p className="font-bold text-white text-sm">{nextProblemTitle || nextProblemSlug}</p>
          </div>
          <Link
            to={`/problems/${nextProblemSlug}`}
            className="px-4 py-2 rounded-xl bg-arena-orange text-white text-xs font-bold hover:bg-arena-orange-hover transition-all flex items-center gap-1.5 shadow-glow shrink-0"
          >
            <span>Solve Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
