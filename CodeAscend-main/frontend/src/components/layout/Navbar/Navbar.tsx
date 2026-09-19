import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarItem } from "./NavbarItem";
import { SearchTrigger } from "./SearchTrigger";
import { RatingChip } from "./RatingChip";
import { UserMenu } from "./UserMenu";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { Menu, LayoutDashboard } from "lucide-react";

type NavbarProps = {
  isPublic?: boolean;
  onOpenSearch?: () => void;
};

const authNavLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/problems", label: "Problems" },
  { to: "/submissions", label: "Submissions" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/analytics", label: "Analytics" },
];

const publicNavLinks = [
  { to: "#hero", label: "Product", isAnchor: true },
  { to: "#story", label: "How It Works", isAnchor: true },
  { to: "#elo", label: "Elo System", isAnchor: true },
  { to: "#problems", label: "Problems", isAnchor: true },
  { to: "#ai", label: "AI Diagnostics", isAnchor: true },
  { to: "#leaderboard", label: "Leaderboard", isAnchor: true },
  { to: "#founder", label: "Meet the Creator", isAnchor: true },
];

export function Navbar({ isPublic = false, onOpenSearch }: NavbarProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      if (isPublic) {
        const sectionIds = ["hero", "story", "elo", "problems", "ai", "leaderboard", "founder"];
        const scrollPosition = window.scrollY + 140;

        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const id = sectionIds[i];
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(`#${id}`);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPublic]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetTo: string) => {
    e.preventDefault();
    const targetId = targetTo.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(targetTo);
    }
  };

  const handleOpenSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-md ${
        isScrolled
          ? "bg-white/90 border-b border-arena-border shadow-sm py-3"
          : "bg-white/80 border-b border-arena-border-subtle py-3.5"
      }`}
    >
      {/* Subtle Purple Radial Glow */}
      <div className="absolute top-0 left-1/4 w-1/2 h-10 bg-[radial-gradient(ellipse_at_top,rgba(139,61,255,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between relative z-10">
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <NavbarBrand isPublic={isPublic} />

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {isPublic
              ? publicNavLinks.map((item) => (
                  <NavbarItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    isAnchor={item.isAnchor}
                    isActive={activeSection === item.to}
                    onClick={(e) => handleAnchorClick(e, item.to)}
                  />
                ))
              : authNavLinks.map((item) => (
                  <NavbarItem key={item.to} to={item.to} label={item.label} />
                ))}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {!isPublic && isAuthenticated ? (
            <>
              {/* Search / Command Trigger */}
              <SearchTrigger onClick={handleOpenSearch} />

              {/* Real Elo Rating Chip */}
              <RatingChip />

              {/* User Account Menu */}
              <UserMenu />
            </>
          ) : isPublic ? (
            <div className="flex items-center gap-3 font-mono text-xs">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-arena-border bg-arena-surface text-arena-text font-semibold hover:border-arena-purple transition-all"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-arena-purple" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-xl bg-arena-purple text-white font-extrabold hover:bg-arena-purple-hover shadow-purple-sm transition-all"
                  >
                    Enter Arena
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 rounded-xl border border-arena-border text-arena-text-secondary hover:text-arena-text hover:bg-arena-surface-subtle transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-4 py-2 rounded-xl bg-arena-purple text-white font-extrabold hover:bg-arena-purple-hover shadow-purple-sm transition-all"
                  >
                    Enter Arena
                  </Link>
                </>
              )}
            </div>
          ) : null}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl border border-arena-border bg-arena-surface text-arena-text-secondary hover:text-arena-text hover:border-arena-purple transition-all"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Sheet */}
      <MobileNavDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onOpenSearch={handleOpenSearch}
        isPublic={isPublic}
      />
    </motion.header>
  );
}
