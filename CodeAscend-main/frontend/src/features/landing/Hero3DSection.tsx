import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Zap,
  CheckCircle2,
  Dna
} from "lucide-react";

export function Hero3DSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const nodes = [
    { label: "CODE", sub: "Monaco Editor", icon: Sparkles },
    { label: "COMPILE", sub: "C++20 / Py3 / Java", icon: Zap },
    { label: "TEST", sub: "Hidden Test Suite", icon: CheckCircle2 },
    { label: "ACCEPT", sub: "100% Verdict", icon: Trophy },
    { label: "+ELO", sub: "+18 Rating Delta", icon: Trophy },
    { label: "ASCEND", sub: "Candidate Master", icon: Dna },
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between px-6 pt-24 pb-16 bg-arena-bg font-sans overflow-hidden">
      {/* Background Perspective Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E7E5EA_1px,transparent_1px),linear-gradient(to_bottom,#E7E5EA_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-arena-purple/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Header */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-arena-purple" />
          <span>COMPETITIVE PROGRAMMING & INTELLIGENT EVALUATION</span>
        </motion.div>

        {/* Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-heading font-extrabold text-arena-text tracking-tight leading-[0.95]"
        >
          CODE. COMPETE. <br />
          <span className="text-arena-purple">ASCEND.</span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-arena-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          Solve algorithmic challenges through a real execution engine, build your competitive rating, and understand how your problem-solving skills evolve.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            to={isAuthenticated ? "/dashboard" : "/auth/register"}
            className="px-8 py-4 rounded-2xl bg-arena-purple text-white font-heading font-extrabold text-sm hover:bg-arena-purple-hover shadow-purple flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <span>Start Solving</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/problems"
            className="px-8 py-4 rounded-2xl border border-arena-border bg-white text-arena-text font-heading font-bold text-sm hover:bg-arena-surface-subtle hover:border-arena-purple-soft transition-all transform hover:-translate-y-0.5 shadow-sm"
          >
            Explore Problems
          </Link>
        </motion.div>

        {/* Tertiary Architecture Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-1"
        >
          <a
            href="#story"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-arena-text-secondary hover:text-arena-purple transition-colors"
          >
            <span>See how the judge works</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>

      {/* Abstract Flowing Ascension Algorithm Visual */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 max-w-6xl mx-auto w-full pt-16"
      >
        <div className="rounded-3xl border border-arena-border bg-white p-6 sm:p-8 shadow-card relative overflow-hidden">
          {/* Top Label */}
          <div className="flex items-center justify-between border-b border-arena-border pb-4 mb-6 font-mono text-xs">
            <span className="font-bold text-arena-text uppercase tracking-wider">Ascension Execution Trajectory</span>
            <span className="text-arena-text-secondary">Spring Boot + Kafka Judge Loop</span>
          </div>

          {/* Node Milestones Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10 font-mono text-xs">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const isLast = i === nodes.length - 1;
              return (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isLast
                      ? "bg-arena-surface-purple border-arena-purple-light shadow-purple-sm"
                      : "bg-arena-surface-subtle border-arena-border hover:border-arena-purple-soft"
                  }`}
                >
                  <div className="flex items-center justify-between text-arena-muted mb-2">
                    <span className="text-[10px] font-bold">0{i + 1}</span>
                    <Icon className={`h-3.5 w-3.5 ${isLast ? "text-arena-purple" : "text-arena-text-secondary"}`} />
                  </div>
                  <strong className={`block font-bold text-sm font-sans ${isLast ? "text-arena-purple font-extrabold" : "text-arena-text"}`}>
                    {node.label}
                  </strong>
                  <span className="text-[11px] text-arena-text-secondary block pt-0.5 truncate">{node.sub}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
