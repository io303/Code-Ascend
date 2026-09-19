import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, Code2, History, Trophy, BarChart3, User } from "lucide-react";

type CommandItem = {
  id: string;
  title: string;
  category: "Navigation" | "Action";
  icon: React.ReactNode;
  action: () => void;
};

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const commands: CommandItem[] = [
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      category: "Navigation",
      icon: <LayoutDashboard className="h-4 w-4 text-arena-purple" />,
      action: () => {
        navigate("/");
        onClose();
      },
    },
    {
      id: "nav-problems",
      title: "Explore Problem Set",
      category: "Navigation",
      icon: <Code2 className="h-4 w-4 text-emerald-600" />,
      action: () => {
        navigate("/problems");
        onClose();
      },
    },
    {
      id: "nav-submissions",
      title: "View Submission History",
      category: "Navigation",
      icon: <History className="h-4 w-4 text-amber-600" />,
      action: () => {
        navigate("/submissions");
        onClose();
      },
    },
    {
      id: "nav-leaderboard",
      title: "Global Leaderboard Standings",
      category: "Navigation",
      icon: <Trophy className="h-4 w-4 text-purple-600" />,
      action: () => {
        navigate("/leaderboard");
        onClose();
      },
    },
    {
      id: "nav-analytics",
      title: "Platform & User Analytics",
      category: "Navigation",
      icon: <BarChart3 className="h-4 w-4 text-arena-purple" />,
      action: () => {
        navigate("/analytics");
        onClose();
      },
    },
    {
      id: "nav-profile",
      title: "View User Profile & Achievements",
      category: "Navigation",
      icon: <User className="h-4 w-4 text-purple-700" />,
      action: () => {
        navigate("/profile");
        onClose();
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-arena-border bg-white shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-arena-purple-light px-4 py-3 bg-arena-surface-purple">
          <Search className="h-5 w-5 text-arena-purple shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search page..."
            autoFocus
            className="w-full bg-transparent text-sm text-arena-text placeholder-arena-muted focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded border border-arena-purple-light bg-white text-[10px] font-mono text-arena-purple font-bold">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-arena-text-secondary">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={cmd.action}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-arena-surface-purple text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {cmd.icon}
                  <span className="text-xs font-semibold text-arena-text group-hover:text-arena-purple transition-colors">
                    {cmd.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-arena-text-secondary uppercase tracking-wider">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
