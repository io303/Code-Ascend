import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CommandPalette } from "@/components/common/CommandPalette";
import { ToastContainer } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar/Navbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const isWorkspace = location.pathname.startsWith("/problems/") && location.pathname !== "/problems";

  // Cmd+K / Ctrl+K listener & custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => setIsCommandOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text font-body flex flex-col selection:bg-arena-purple/20 selection:text-arena-purple">
      {/* Redesigned Premium Navbar */}
      <Navbar onOpenSearch={() => setIsCommandOpen(true)} />

      {/* Main Content Viewport */}
      <main className={`flex-1 ${isWorkspace ? "p-0" : "mx-auto w-full max-w-7xl px-4 sm:px-6 py-6"}`}>
        {children}
      </main>

      {/* Global Command Palette & Toast Notifications */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      <ToastContainer />
    </div>
  );
}
