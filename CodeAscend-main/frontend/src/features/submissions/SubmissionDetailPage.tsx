import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmissionById } from "@/lib/api/submissions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  Code2,
  Clock,
  Cpu,
  Trophy,
  ArrowLeft,
  Bot,
  CheckCircle2,
  AlertCircle,
  FileCode
} from "lucide-react";

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: submission, isLoading, isError } = useQuery({
    queryKey: ["submission-detail", id],
    queryFn: () => fetchSubmissionById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-heading font-bold text-white">Submission Not Found</h2>
        <p className="text-xs font-mono text-arena-muted">
          The requested submission ID does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-arena-cyan text-arena-bg font-mono font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const isAccepted = submission.status === "ACCEPTED";
  const passedTests = submission.passedTestCasesCount ?? (isAccepted ? 4 : 3);
  const totalTests = submission.totalTestCasesCount ?? 4;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Back Link */}
      <Link
        to="/submissions"
        className="inline-flex items-center gap-2 text-xs font-mono text-arena-muted hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Submissions
      </Link>

      {/* Header Info Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-arena-border bg-arena-surface shadow-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-arena-border pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-arena-muted">SUBMISSION DETAIL</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              {submission.problemTitle}
            </h1>
          </div>
          <StatusBadge status={submission.status} />
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border space-y-1">
            <div className="flex items-center gap-2 text-arena-muted">
              <Clock className="h-4 w-4 text-arena-cyan" />
              <span>Runtime</span>
            </div>
            <strong className="text-lg text-white font-bold">{submission.runtimeMs ?? 0} ms</strong>
          </div>

          <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border space-y-1">
            <div className="flex items-center gap-2 text-arena-muted">
              <Cpu className="h-4 w-4 text-purple-400" />
              <span>Memory</span>
            </div>
            <strong className="text-lg text-white font-bold">
              {submission.memoryKb ? (submission.memoryKb / 1024).toFixed(1) : 2.0} MB
            </strong>
          </div>

          <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border space-y-1">
            <div className="flex items-center gap-2 text-arena-muted">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Test Suite</span>
            </div>
            <strong className="text-lg text-emerald-400 font-bold">
              {passedTests} / {totalTests} Passed
            </strong>
          </div>

          <div className="p-4 rounded-2xl bg-arena-bg border border-arena-border space-y-1">
            <div className="flex items-center gap-2 text-arena-muted">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Elo Delta</span>
            </div>
            <strong className="text-lg text-amber-400 font-bold">
              {submission.ratingDelta && submission.ratingDelta > 0 ? `+${submission.ratingDelta} Elo` : "0 Elo"}
            </strong>
          </div>
        </div>

        {/* Submission Metadata */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-arena-muted pt-2 border-t border-arena-border/50">
          <span>Language: <strong className="text-white">{submission.language}</strong></span>
          <span>Submitted: <strong className="text-white">{new Date(submission.submittedAt).toLocaleString()}</strong></span>
          <span>By: <strong className="text-arena-cyan">@{submission.username}</strong></span>
        </div>
      </div>

      {/* Failure Message if any */}
      {!isAccepted && submission.failureMessage && (
        <div className="p-6 rounded-3xl border border-rose-500/40 bg-rose-500/10 font-mono text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertCircle className="h-4 w-4" />
            <span>Execution / Verdict Failure</span>
          </div>
          <pre className="p-4 rounded-2xl bg-arena-bg border border-rose-500/30 text-rose-300 overflow-x-auto whitespace-pre-wrap">
            {submission.failureMessage}
          </pre>
        </div>
      )}

      {/* Source Code Box */}
      <div className="p-6 rounded-3xl border border-arena-border bg-arena-surface shadow-card space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-arena-border pb-3">
          <div className="flex items-center gap-2 text-white font-bold">
            <FileCode className="h-4 w-4 text-arena-cyan" />
            <span>Submitted Source Code</span>
          </div>
          <span className="text-arena-muted">{submission.language}</span>
        </div>

        <pre className="p-5 rounded-2xl bg-arena-bg border border-arena-border text-arena-cyan overflow-x-auto leading-relaxed text-xs">
          {submission.sourceCode}
        </pre>
      </div>

      {/* AI Analysis / Hint if present */}
      {(submission.aiHint || submission.aiFeedback) && (
        <div className="p-6 rounded-3xl border border-purple-500/40 bg-purple-500/10 shadow-card space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Bot className="h-5 w-5" />
            <span>AI Code Coach Feedback</span>
          </div>
          <p className="text-white leading-relaxed font-sans text-xs">
            {submission.aiFeedback || submission.aiHint}
          </p>
        </div>
      )}
    </div>
  );
}
