import type { SubmissionStatus } from "@/types";

type Props = {
  status: SubmissionStatus;
  className?: string;
};

export function StatusBadge({ status, className = "" }: Props) {
  const config = {
    ACCEPTED: {
      label: "Accepted",
      style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    WRONG_ANSWER: {
      label: "Wrong Answer",
      style: "bg-rose-50 text-rose-700 border-rose-200",
    },
    TIME_LIMIT_EXCEEDED: {
      label: "Time Limit Exceeded",
      style: "bg-amber-50 text-amber-800 border-amber-200",
    },
    MEMORY_LIMIT_EXCEEDED: {
      label: "Memory Limit Exceeded",
      style: "bg-purple-50 text-purple-700 border-purple-200",
    },
    COMPILATION_ERROR: {
      label: "Compilation Error",
      style: "bg-yellow-50 text-yellow-800 border-yellow-200",
    },
    RUNTIME_ERROR: {
      label: "Runtime Error",
      style: "bg-orange-50 text-orange-700 border-orange-200",
    },
    PENDING: {
      label: "Pending",
      style: "bg-amber-50 text-amber-800 border-amber-200 animate-pulse",
    },
    RUNNING: {
      label: "Evaluating...",
      style: "bg-purple-50 text-purple-700 border-purple-200 animate-pulse",
    },
  };

  const item = config[status] ?? { label: status, style: "bg-arena-surface-subtle border-arena-border text-arena-text" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.style} ${className}`}
    >
      {(status === "PENDING" || status === "RUNNING") && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
      )}
      {item.label}
    </span>
  );
}
