import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchMySubmissions, fetchSubmissionById } from "@/lib/api/submissions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState, ErrorCard, Skeleton } from "@/components/ui/FeedbackComponents";
import type { SubmissionDetail } from "@/types";
import { History, Code2, X, Sparkles, ExternalLink } from "lucide-react";

export function SubmissionsPage() {
  const [page, setPage] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-submissions", page],
    queryFn: () => fetchMySubmissions(page, 15),
  });

  const handleViewDetail = async (id: string) => {
    try {
      const detail = await fetchSubmissionById(id);
      setSelectedSubmission(detail);
    } catch (e) {
      console.error("Failed to load submission detail", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white p-6 sm:p-8 shadow-purple-sm space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-arena-purple-light bg-arena-surface-purple px-3.5 py-1 text-xs font-mono font-semibold text-arena-purple select-none cursor-default">
          <History className="h-3.5 w-3.5 text-arena-purple" />
          <span>Execution Log</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-arena-text tracking-tight">
          Submission History
        </h1>
        <p className="text-xs sm:text-sm text-arena-text-secondary">
          Review past code submissions, execution runtimes, memory metrics, and AI analysis reports.
        </p>
      </div>

      {/* Submissions Table */}
      <div className="rounded-2xl border border-arena-border bg-white overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorCard message="Failed to load submission history." onRetry={refetch} />
          </div>
        ) : !data || data.content.length === 0 ? (
          <EmptyState title="No submissions yet" description="Solve problems in the workspace to view your submission history." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-arena-text">
              <thead className="border-b border-arena-border bg-arena-surface-subtle text-xs font-semibold uppercase tracking-wider text-arena-text-secondary">
                <tr>
                  <th className="px-6 py-4">Problem</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Runtime</th>
                  <th className="px-6 py-4">Memory</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arena-border">
                {data.content.map((sub) => (
                  <tr key={sub.id} className="hover:bg-arena-surface-purple transition-colors">
                    <td className="px-6 py-4 font-semibold text-arena-text">
                      <Link to={`/problems/${sub.problemSlug}`} className="hover:text-arena-purple transition-colors">
                        {sub.problemTitle}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-arena-text-secondary whitespace-nowrap">
                      {sub.language}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                      {sub.runtimeMs != null ? `${sub.runtimeMs}ms` : "-"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                      {sub.memoryKb != null ? `${sub.memoryKb}KB` : "-"}
                    </td>
                    <td className="px-6 py-4 text-xs text-arena-text-secondary whitespace-nowrap">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(sub.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-arena-purple-light bg-arena-surface-purple text-xs font-semibold text-arena-purple hover:bg-arena-purple hover:text-white transition-all shadow-sm"
                      >
                        Inspect Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-arena-border bg-arena-surface-subtle px-6 py-4">
            <span className="text-xs text-arena-text-secondary">
              Page <strong className="text-arena-text">{data.page + 1}</strong> of{" "}
              <strong className="text-arena-text">{data.totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={data.page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-xl border border-arena-border bg-white px-3.5 py-1.5 text-xs font-semibold text-arena-text disabled:opacity-40 hover:bg-arena-surface-purple transition-colors shadow-sm"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-arena-border bg-white px-3.5 py-1.5 text-xs font-semibold text-arena-text disabled:opacity-40 hover:bg-arena-surface-purple transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-3xl border border-arena-border bg-white p-6 sm:p-8 shadow-card overflow-y-auto space-y-6 text-arena-text">
            <div className="flex items-center justify-between border-b border-arena-border pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-heading font-bold text-arena-text flex items-center gap-2">
                  <span>{selectedSubmission.problemTitle}</span>
                  <Link to={`/problems/${selectedSubmission.problemSlug}`} className="text-arena-purple hover:underline">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <StatusBadge status={selectedSubmission.status} />
                  <span className="font-mono text-arena-text-secondary">{selectedSubmission.language}</span>
                  <span className="text-arena-text-secondary">• {new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="rounded-xl p-2 text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-purple"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl border border-arena-border bg-arena-surface-subtle">
                <span className="text-[10px] text-arena-text-secondary block uppercase font-sans">Runtime</span>
                <span className="text-arena-text font-bold">{selectedSubmission.runtimeMs != null ? `${selectedSubmission.runtimeMs}ms` : "-"}</span>
              </div>
              <div className="p-3 rounded-xl border border-arena-border bg-arena-surface-subtle">
                <span className="text-[10px] text-arena-text-secondary block uppercase font-sans">Memory</span>
                <span className="text-arena-text font-bold">{selectedSubmission.memoryKb != null ? `${selectedSubmission.memoryKb}KB` : "-"}</span>
              </div>
              <div className="p-3 rounded-xl border border-arena-border bg-arena-surface-subtle">
                <span className="text-[10px] text-arena-text-secondary block uppercase font-sans">Originality</span>
                <span className="text-emerald-700 font-bold">{100 - (selectedSubmission.aiPlagiarismScore ?? 0)}% Unique</span>
              </div>
              <div className="p-3 rounded-xl border border-arena-border bg-arena-surface-subtle">
                <span className="text-[10px] text-arena-text-secondary block uppercase font-sans">Status</span>
                <span className="text-arena-purple font-bold">{selectedSubmission.status}</span>
              </div>
            </div>

            {/* Source Code */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-arena-text uppercase tracking-wider">Submitted Source Code</span>
              <pre className="p-4 rounded-2xl border border-[#313244] bg-[#1E1E2E] font-mono text-xs text-[#CDD6F4] overflow-x-auto">
                {selectedSubmission.sourceCode}
              </pre>
            </div>

            {/* AI Quality Feedback */}
            {selectedSubmission.aiFeedback && (
              <div className="p-4 rounded-2xl border border-arena-purple-light bg-arena-surface-purple space-y-1">
                <span className="text-xs font-semibold text-arena-purple uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-arena-purple" />
                  <span>AI Quality Insights</span>
                </span>
                <p className="text-xs text-arena-text leading-relaxed">{selectedSubmission.aiFeedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
