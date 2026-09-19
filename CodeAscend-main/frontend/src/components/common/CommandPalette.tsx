import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProblems } from "@/lib/api/problems";
import {
  Search,
  Code2,
  LayoutDashboard,
  Trophy,
  BarChart2,
  User,
  History,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: problemsData } = useQuery({
    queryKey: ["command-palette-problems", query],
    queryFn: () => fetchProblems({ search: query, page: 0, size: 6 }),
    enabled: isOpen,
  });

  const problems = problemsData?.content ?? [];

  const quickNav = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Daily Challenge", path: "/dashboard", icon: Sparkles },
    { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { label: "Analytics & Code DNA", path: "/analytics", icon: BarChart2 },
    { label: "Profile", path: "/profile", icon: User },
    { label: "My Submissions", path: "/submissions", icon: History },
  ];

  const filteredNav = quickNav.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    ...filteredNav.map((n) => ({ type: "nav" as const, item: n })),
    ...problems.map((p) => ({ type: "problem" as const, item: p })),
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or custom event
          window.dispatchEvent(new CustomEvent("open-command-palette"));
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          const selected = allItems[selectedIndex];
          if (selected.type === "nav") {
            navigate(selected.item.path);
          } else {
            navigate(`/problems/${selected.item.slug}`);
          }
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, allItems, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl rounded-3xl border border-arena-cyan/40 bg-arena-surface shadow-cyan-lg overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-arena-border">
          <Search className="h-5 w-5 text-arena-cyan" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search problems, navigate arena, or press Esc to close..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-white placeholder-arena-muted focus:outline-none font-sans"
          />
          <kbd className="px-2 py-1 text-[10px] font-mono bg-arena-bg border border-arena-border rounded-lg text-arena-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-arena-muted font-sans text-xs">
              No matching problems or actions found.
            </div>
          ) : (
            allItems.map((entry, idx) => {
              const isSelected = idx === selectedIndex;
              if (entry.type === "nav") {
                const Icon = entry.item.icon;
                return (
                  <button
                    key={`nav-${entry.item.label}`}
                    type="button"
                    onClick={() => {
                      navigate(entry.item.path);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isSelected
                        ? "bg-arena-cyan/15 border border-arena-cyan/40 text-white font-bold"
                        : "text-arena-text hover:bg-arena-bg/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 font-sans text-xs">
                      <Icon className={`h-4 w-4 ${isSelected ? "text-arena-cyan" : "text-arena-muted"}`} />
                      <span>{entry.item.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                  </button>
                );
              } else {
                const problem = entry.item;
                return (
                  <button
                    key={`prob-${problem.slug}`}
                    type="button"
                    onClick={() => {
                      navigate(`/problems/${problem.slug}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isSelected
                        ? "bg-arena-cyan/15 border border-arena-cyan/40 text-white font-bold"
                        : "text-arena-text hover:bg-arena-bg/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 font-sans text-xs">
                      <Code2 className={`h-4 w-4 ${isSelected ? "text-arena-cyan" : "text-arena-muted"}`} />
                      <span>{problem.title}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold ${
                          problem.difficulty === "EASY"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : problem.difficulty === "MEDIUM"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </button>
                );
              }
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-arena-bg/80 border-t border-arena-border text-[11px] text-arena-muted flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>CodeAscend Quick Search</span>
        </div>
      </div>
    </div>
  );
}
