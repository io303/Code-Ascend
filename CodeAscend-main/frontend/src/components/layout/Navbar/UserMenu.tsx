import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { fetchMyProfile } from "@/lib/api/users";
import {
  User as UserIcon,
  History,
  Star,
  LogOut,
  ChevronDown,
  Trophy,
} from "lucide-react";

export function UserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const rating = profile?.rating ?? 1200;
  const initialLetter = (user?.displayName || user?.username || "U").charAt(0).toUpperCase();

  const handleLogout = () => {
    setIsOpen(false);
    clearSession();
    navigate("/", { replace: true });
  };

  // Close dropdown on click outside & Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative select-none">
      {/* User Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-arena-border bg-white hover:border-arena-purple text-xs font-mono text-arena-text transition-all duration-180 shadow-sm"
        aria-expanded={isOpen}
        aria-label="User account menu"
      >
        {/* Avatar */}
        <div className="h-6 w-6 rounded-lg bg-arena-purple font-extrabold text-white flex items-center justify-center text-xs shadow-purple-sm">
          {initialLetter}
        </div>
        <span className="font-semibold text-arena-text">{user.displayName || user.username}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-arena-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180 text-arena-purple" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 rounded-2xl border border-arena-border bg-white p-2 shadow-2xl z-50 font-mono text-xs space-y-1"
          >
            {/* Header info */}
            <div className="px-3 py-2.5 rounded-xl bg-arena-surface-purple border border-arena-purple-light space-y-1">
              <p className="font-sans font-bold text-arena-text text-xs truncate">
                {user.displayName}
              </p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-arena-text-secondary">@{user.username}</span>
                <span className="inline-flex items-center gap-1 text-amber-800 font-bold">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  {rating} ELO
                </span>
              </div>
            </div>

            <div className="h-px bg-arena-border my-1" />

            {/* Menu Items */}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-arena-text hover:bg-arena-surface-purple hover:text-arena-purple transition-colors"
            >
              <UserIcon className="h-3.5 w-3.5 text-arena-purple" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/submissions"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-arena-text hover:bg-arena-surface-purple hover:text-arena-purple transition-colors"
            >
              <History className="h-3.5 w-3.5 text-purple-600" />
              <span>My Submissions</span>
            </Link>

            <Link
              to="/problems?filter=bookmarked"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-arena-text hover:bg-arena-surface-purple hover:text-arena-purple transition-colors"
            >
              <Star className="h-3.5 w-3.5 text-amber-500" />
              <span>Bookmarks</span>
            </Link>

            <div className="h-px bg-arena-border my-1" />

            {/* Logout Option */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors text-left font-semibold"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-600" />
              <span>Log Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
