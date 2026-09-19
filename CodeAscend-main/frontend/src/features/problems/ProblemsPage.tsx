import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAllTags, fetchProblems, toggleBookmark } from "@/lib/api/problems";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { EmptyState, ErrorCard, Skeleton } from "@/components/ui/FeedbackComponents";
import type { ProblemDifficulty } from "@/types";
import { Search, Star, CheckCircle2, Clock, ArrowRight, Tag, Code2, Sparkles } from "lucide-react";

export function ProblemsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title");

  const { data: tagsData } = useQuery({
    queryKey: ["problem-tags"],
    queryFn: fetchAllTags,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["problems", page, search, difficulty, selectedTag, sortBy],
    queryFn: () =>
      fetchProblems({
        page,
        size: 15,
        search: search.trim() || undefined,
        difficulty: (difficulty as ProblemDifficulty) || undefined,
        tag: selectedTag || undefined,
        sortBy,
        sortOrder: "asc",
      }),
  });

  const bookmarkMutation = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value);
    setPage(0);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? "" : tag));
    setPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white p-6 sm:p-8 shadow-purple-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-arena-purple-light bg-arena-surface-purple px-3.5 py-1 text-xs font-mono font-semibold text-arena-purple select-none cursor-default">
            <Sparkles className="h-3.5 w-3.5 text-arena-purple" />
            <span>Problem Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-arena-text tracking-tight">
            Solve. Measure. Improve.
          </h1>
          <p className="text-xs sm:text-sm text-arena-text-secondary leading-relaxed">
            Targeted problem challenges across Easy, Medium, and Hard difficulties. Filter by topic tags, bookmark challenges, and test solutions against hidden test suites.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-2xl border border-arena-border bg-white p-5 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-arena-muted" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search problems by title or keyword..."
              className="w-full rounded-xl border border-arena-border bg-white pl-10 pr-4 py-2.5 text-sm text-arena-text placeholder-arena-muted focus:border-arena-purple focus:ring-1 focus:ring-arena-purple focus:outline-none transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={handleDifficultyChange}
              className="rounded-xl border border-arena-border bg-white px-3.5 py-2.5 text-xs font-semibold text-arena-text focus:border-arena-purple focus:outline-none"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-arena-border bg-white px-3.5 py-2.5 text-xs font-semibold text-arena-text focus:border-arena-purple focus:outline-none"
            >
              <option value="title">Sort by Title</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="acceptanceRate">Sort by Acceptance Rate</option>
              <option value="createdAt">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Tags Bar */}
        {tagsData && tagsData.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-arena-border pb-1">
            <Tag className="h-3.5 w-3.5 text-arena-muted shrink-0" />
            <button
              type="button"
              onClick={() => setSelectedTag("")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                selectedTag === ""
                  ? "bg-arena-purple text-white shadow-purple-sm"
                  : "bg-arena-surface-subtle border border-arena-border text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-purple"
              }`}
            >
              All Topics
            </button>
            {tagsData.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedTag === tag
                    ? "bg-arena-purple text-white shadow-purple-sm"
                    : "bg-arena-surface-subtle border border-arena-border text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-purple"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl border border-arena-border bg-white overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-arena-border">
                <Skeleton className="h-6 w-1/3 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorCard message="Failed to load problems. Please check backend connection." onRetry={refetch} />
          </div>
        ) : !data || data.content.length === 0 ? (
          <EmptyState title="No problems found" description="Try broadening your search query or clearing tag filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-arena-text">
              <thead className="border-b border-arena-border bg-arena-surface-subtle text-xs font-semibold uppercase tracking-wider text-arena-text-secondary">
                <tr>
                  <th className="px-4 py-4 text-center w-12">Status</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Acceptance</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arena-border">
                {data.content.map((problem) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-arena-surface-purple transition-colors group"
                  >
                    {/* Status Column */}
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      {problem.userStatus === "SOLVED" ? (
                        <span title="Solved"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" /></span>
                      ) : problem.userStatus === "ATTEMPTED" ? (
                        <span title="Attempted"><Clock className="h-4 w-4 text-amber-500 inline-block" /></span>
                      ) : (
                        <span className="text-arena-muted text-xs">-</span>
                      )}
                    </td>

                    {/* Title + Bookmark Button */}
                    <td className="px-6 py-4 font-medium text-arena-text group-hover:text-arena-purple transition-colors">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => bookmarkMutation.mutate(problem.slug)}
                          className={`p-1 rounded-md transition-all ${
                            problem.isBookmarked ? "text-amber-500" : "text-arena-muted hover:text-amber-500"
                          }`}
                          title={problem.isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                        >
                          <Star className={`h-4 w-4 ${problem.isBookmarked ? "fill-amber-400 text-amber-500" : ""}`} />
                        </button>
                        <Link to={`/problems/${problem.slug}`} className="block font-semibold">
                          {problem.title}
                        </Link>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-arena-text-secondary">
                      {problem.acceptanceRate}%
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {problem.tags && problem.tags.length > 0 ? (
                          problem.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-arena-surface-subtle border border-arena-border text-arena-text-secondary"
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-arena-muted">General</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/problems/${problem.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-arena-surface-purple text-arena-purple border border-arena-purple-light hover:bg-arena-purple hover:text-white transition-all text-xs font-semibold shadow-sm"
                      >
                        <span>Solve</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
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
              <strong className="text-arena-text">{data.totalPages}</strong> ({data.totalElements} problems)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={data.page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-xl border border-arena-border bg-white px-3.5 py-1.5 text-xs font-semibold text-arena-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-arena-surface-purple transition-colors shadow-sm"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-arena-border bg-white px-3.5 py-1.5 text-xs font-semibold text-arena-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-arena-surface-purple transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
