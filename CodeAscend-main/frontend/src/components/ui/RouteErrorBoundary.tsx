import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Compass } from "lucide-react";

export function RouteErrorBoundary() {
  const error = useRouteError();
  let title = "Lost in the Arena?";
  let message = "The page you're looking for was not found or encountered an execution exception.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = (error.data as { message?: string })?.message || "The requested route could not be loaded.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text font-body flex items-center justify-center p-6 selection:bg-arena-orange/30 selection:text-arena-orange">
      <div className="max-w-md w-full rounded-3xl border border-arena-border bg-arena-surface p-8 shadow-card space-y-6 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-arena-orange/15 border border-arena-orange/30 text-arena-orange flex items-center justify-center shadow-glow">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-white">{title}</h2>
          <p className="text-xs text-arena-muted leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border border-arena-border bg-arena-bg text-white hover:bg-arena-surface-hover transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Page</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-arena-orange text-white hover:bg-arena-orange-hover transition-all shadow-glow"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Return to Arena</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
