import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Hero3DSection } from "./Hero3DSection";
import { WhyCodeAscendSection } from "./WhyCodeAscendSection";
import { WorkspacePreviewSection } from "./WorkspacePreviewSection";
import { ExecutionPipelineSection } from "./ExecutionPipelineSection";
import { EloGraphSection } from "./EloGraphSection";
import { ProblemUniverseSection } from "./ProblemUniverseSection";
import { AiFailureSection } from "./AiFailureSection";
import { LeaderboardRealSection } from "./LeaderboardRealSection";
import { FaqSection } from "./FaqSection";
import { TechMarquee } from "./TechMarquee";
import { FounderSection } from "./FounderSection";
import { LandingFooter } from "./LandingFooter";
import codearenaMark from "@/assets/branding/codearena-mark.png";
import {
  ArrowRight,
  Terminal,
} from "lucide-react";

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text selection:bg-arena-purple-light selection:text-arena-purple overflow-x-hidden">
      
      {/* Shared Premium Glass Navbar */}
      <Navbar isPublic={true} />

      {/* 1. Hero Section */}
      <div id="hero">
        <Hero3DSection />
      </div>

      {/* 2. Why CodeAscend Section */}
      <div id="why">
        <WhyCodeAscendSection />
      </div>

      {/* 3. Interactive IDE Workspace Preview */}
      <div id="workspace-preview">
        <WorkspacePreviewSection />
      </div>

      {/* 4. Execution Pipeline Section ("Real Evaluation Pipeline") */}
      <div id="story">
        <ExecutionPipelineSection />
      </div>

      {/* 5. Elo Rating Competition */}
      <div id="elo">
        <EloGraphSection />
      </div>

      {/* 6. Code DNA Skill Analysis */}
      <div id="problems">
        <ProblemUniverseSection />
      </div>

      {/* 7. Engineering Depth & AI Diagnostics */}
      <div id="ai">
        <AiFailureSection />
      </div>

      {/* 8. Real Global Leaderboard */}
      <div id="leaderboard">
        <LeaderboardRealSection />
      </div>

      {/* 9. Architecture FAQ */}
      <div id="faq">
        <FaqSection />
      </div>

      {/* Final Call to Action */}
      <section className="py-16 sm:py-20 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="rounded-3xl border border-arena-purple-light bg-gradient-to-br from-white via-arena-surface-purple to-white p-10 sm:p-14 space-y-6 shadow-purple-sm relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple">
            <Terminal className="h-3.5 w-3.5" />
            <span>Start Your Ascent</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-arena-text tracking-tight leading-tight">
            READY TO ASCEND?
          </h2>

          <p className="text-sm text-arena-text-secondary max-w-xl mx-auto">
            Solve the next problem. Build your rating. Understand your progress.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth/register"}
              className="px-8 py-4 rounded-2xl bg-arena-purple text-white font-heading font-extrabold text-sm hover:bg-arena-purple-hover shadow-purple flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Coding Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/how-it-works"
              className="px-8 py-4 rounded-2xl border border-arena-purple-light bg-arena-surface-purple text-arena-purple font-heading font-bold text-sm hover:bg-arena-purple-verylight transition-all transform hover:-translate-y-0.5"
            >
              Inspect Architecture
            </Link>

            <Link
              to={isAuthenticated ? "/problems" : "/auth/login"}
              className="px-8 py-4 rounded-2xl border border-arena-border bg-white text-arena-text font-heading font-bold text-sm hover:bg-arena-surface-subtle transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
              Explore Problems
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Meet the Creator / Founder Section */}
      <div id="founder">
        <FounderSection />
      </div>

      {/* 11. Tech Stack Marquee Pre-Footer */}
      <TechMarquee />

      {/* 12. Main 4-Column Dark SaaS Footer */}
      <LandingFooter />
    </div>
  );
}
