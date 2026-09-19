export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-arena-border/60 ${className}`}
    />
  );
}

export function ErrorCard({
  message = "Failed to load data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-arena-error/30 bg-arena-error/10 p-6 text-center shadow-card">
      <p className="text-sm font-medium text-arena-error">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-arena-error/20 px-4 py-2 text-xs font-semibold text-arena-error hover:bg-arena-error/30 transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "No data found",
  description = "There are no items matching your request.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-arena-border bg-arena-surface p-12 text-center shadow-card">
      <div className="mx-auto h-12 w-12 rounded-full bg-arena-border/50 flex items-center justify-center text-arena-muted mb-3">
        🔍
      </div>
      <h3 className="text-lg font-heading font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-arena-muted">{description}</p>
    </div>
  );
}
