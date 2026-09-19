import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { fetchMyProfile } from "@/lib/api/users";
import {
  X,
  Search,
  Trophy,
  User as UserIcon,
  History,
  Star,
  LogOut,
  LayoutDashboard,
  Code2,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";

import codearenaMark from "@/assets/branding/codearena-mark.png";

type MobileNavDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  isPublic?: boolean;
};

export function MobileNavDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  isPublic = false,
}: MobileNavDrawerProps) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    enabled: isAuthenticated,
  });

  const rating = profile?.rating ?? 1200;

  const handleLogout = () => {
    onClose();
    clearSession();
    navigate("/", { replace: true });
  };

  type NavItemType = { to: string; label: string; isAnchor?: boolean; icon?: any };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetTo: string) => {
    e.preventDefault();
    onClose();
    const targetId = targetTo.replace("#", "");
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  const navItems: NavItemType[] = isPublic
    ? [
        { to: "#hero", label: "Product", isAnchor: true },
        { to: "#story", label: "How It Works", isAnchor: true },
        { to: "#elo", label: "Elo System", isAnchor: true },
        { to: "#problems", label: "Problems", isAnchor: true },
        { to: "#ai", label: "AI Diagnostics", isAnchor: true },
        { to: "#leaderboard", label: "Leaderboard", isAnchor: true },
        { to: "#founder", label: "Meet the Creator", isAnchor: true },
      ]
    : [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/problems", label: "Problems", icon: Code2 },
        { to: "/submissions", label: "Submissions", icon: History },
        { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
        { to: "/analytics", label: "Analytics", icon: BarChart3 },
      ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md lg:hidden"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white border-l border-arena-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto lg:hidden font-mono text-sm"
          >
            {/* Top Bar */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-arena-border pb-4">
                <div className="flex items-center gap-2">
                  <img src={codearenaMark} alt="CodeAscend Logo" className="h-8 w-auto object-contain" />
                  <span className="font-heading font-extrabold text-arena-text text-base">
                    Code<span className="text-arena-purple">Ascend</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl border border-arena-border text-arena-text-secondary hover:text-arena-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Search Action */}
              {!isPublic && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-arena-purple-light bg-arena-surface-purple text-xs text-arena-purple font-semibold hover:border-arena-purple transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4 text-arena-purple" />
                    <span>Search problems...</span>
                  </div>
                  <kbd className="px-2 py-0.5 rounded border border-arena-purple-light bg-white text-[10px] font-bold">
                    ⌘K
                  </kbd>
                </button>
              )}

              {/* Main Navigation Links */}
              <div className="space-y-1.5 pt-2">
                {navItems.map((item) => {
                  if (item.isAnchor) {
                    return (
                      <a
                        key={item.to}
                        href={item.to}
                        onClick={(e) => handleAnchorClick(e, item.to)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-purple transition-all"
                      >
                        <Layers className="h-4 w-4 text-arena-purple" />
                        <span>{item.label}</span>
                      </a>
                    );
                  }

                  const Icon = item.icon || Code2;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                          isActive
                            ? "bg-arena-surface-purple text-arena-purple border border-arena-purple-light font-bold"
                            : "text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-subtle",
                        ].join(" ")
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              {/* Profile & Secondary Options for Authenticated Users */}
              {isAuthenticated && user && !isPublic && (
                <div className="pt-4 border-t border-arena-border space-y-2">
                  <div className="p-3.5 rounded-2xl bg-arena-surface-purple border border-arena-purple-light flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-arena-purple text-white font-extrabold flex items-center justify-center text-xs">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-arena-text text-xs truncate max-w-[120px]">
                          {user.displayName}
                        </p>
                        <p className="text-[11px] text-arena-text-secondary">@{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-xs bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      <span>{rating}</span>
                    </div>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-arena-text hover:bg-arena-surface-purple"
                  >
                    <UserIcon className="h-4 w-4 text-arena-purple" />
                    <span>My Profile</span>
                  </NavLink>

                  <NavLink
                    to="/problems?filter=bookmarked"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-arena-text hover:bg-arena-surface-purple"
                  >
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Bookmarks</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-arena-border">
              {isAuthenticated && !isPublic ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs hover:bg-rose-100 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <NavLink
                    to="/auth/login"
                    onClick={onClose}
                    className="w-full block text-center py-3 rounded-2xl border border-arena-border text-arena-text font-semibold text-xs hover:bg-arena-surface-subtle"
                  >
                    Log In
                  </NavLink>
                  <NavLink
                    to="/auth/register"
                    onClick={onClose}
                    className="w-full block text-center py-3 rounded-2xl bg-arena-purple text-white font-extrabold text-xs hover:bg-arena-purple-hover shadow-purple-sm"
                  >
                    Enter Arena
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
