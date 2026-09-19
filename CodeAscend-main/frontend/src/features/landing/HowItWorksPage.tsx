import React from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Cpu,
  Layers,
  ShieldCheck,
  Trophy,
  Dna,
  Terminal,
  ArrowLeft,
  ArrowRight,
  Code2,
  CheckCircle2,
  Lock,
  Activity,
  Workflow
} from "lucide-react";

import codearenaMark from "@/assets/branding/codearena-mark.png";

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-arena-bg text-arena-text selection:bg-arena-purple/20 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header Navigation */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-arena-border">
        <Link to="/" className="flex items-center gap-3 group" title="Return to CodeAscend Home">
          <img src={codearenaMark} alt="CodeAscend Logo" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
          <span className="font-heading font-extrabold text-xl text-arena-text tracking-tight">
            Code<span className="text-arena-purple">Ascend</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-arena-border bg-white text-xs font-mono font-semibold text-arena-text hover:border-arena-purple transition-all shadow-sm"
          >
            <span>Sign In</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-arena-border bg-white text-xs font-mono font-semibold text-arena-text-secondary hover:text-arena-text hover:border-arena-purple transition-all shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full py-10 space-y-16 flex-1">
        
        {/* Title Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
            <Workflow className="h-3.5 w-3.5 text-arena-purple" />
            <span>INSIDE CODEASCEND</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-arena-text tracking-tight">
            CodeAscend Architecture & Execution Engine
          </h1>

          <p className="text-sm sm:text-base text-arena-text-secondary leading-relaxed">
            A comprehensive technical breakdown of CodeAscend's multi-language code execution container lifecycle, asynchronous Kafka event pipeline, deterministic Elo rating math, anti-farming algorithms, and Code DNA skill intelligence.
          </p>
        </div>

        {/* Section 1: End-to-End System Architecture */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-arena-border pb-3">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-arena-text flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-arena-purple" />
              <span>1. System Architecture Topology</span>
            </h2>
            <span className="text-xs font-mono text-arena-muted hidden sm:inline">Stateless REST + Async Kafka Workers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Component 1: Client */}
            <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple flex items-center justify-center">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-arena-text text-base">Client Layer</h3>
              <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                React 18 SPA built with Vite, TypeScript, Monaco Editor, and Framer Motion. Handles local code state, stdin input customization, and polling submission status.
              </p>
            </div>

            {/* Component 2: API Gateway & Auth */}
            <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple flex items-center justify-center">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-arena-text text-base">API & Queue Layer</h3>
              <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                Spring Boot 3 REST services protecting private endpoints via BCrypt & stateless JWT. Dispatches serialized submissions into Kafka <code className="text-arena-purple font-bold">submission-events</code> topics.
              </p>
            </div>

            {/* Component 3: Judge Worker */}
            <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-arena-text text-base">Judge Execution Worker</h3>
              <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                Isolated container processes executing compiled binaries against hidden test cases under strict cgroup limits (CPU, RSS memory, wall-clock time).
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Submission Lifecycle Step-by-Step */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-arena-border pb-3">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-arena-text flex items-center gap-2.5">
              <Activity className="h-5 w-5 text-amber-500" />
              <span>2. Submission Execution Lifecycle</span>
            </h2>
            <span className="text-xs font-mono text-arena-muted hidden sm:inline">Asynchronous Lifecycle States</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-sm flex items-start gap-4">
              <span className="px-2.5 py-1 rounded-xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple font-bold shrink-0">STEP 01</span>
              <div className="space-y-1">
                <h4 className="font-bold text-arena-text text-sm font-sans">Dispatch & Queueing (PENDING)</h4>
                <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                  When a user clicks <strong>Submit</strong>, the frontend issues a POST request. The Spring Boot backend records a <code className="text-arena-purple font-bold">PENDING</code> submission in PostgreSQL and publishes a Kafka payload to prevent web thread blocking.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-sm flex items-start gap-4">
              <span className="px-2.5 py-1 rounded-xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple font-bold shrink-0">STEP 02</span>
              <div className="space-y-1">
                <h4 className="font-bold text-arena-text text-sm font-sans">Compilation & Container Setup (RUNNING)</h4>
                <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                  The consumer worker claims the event and sets status to <code className="text-arena-purple font-bold">RUNNING</code>. It compiles C++20 using <code className="text-arena-purple font-bold">g++ -O2</code>, Java using <code className="text-arena-purple font-bold">javac</code>, or pre-checks Python 3 & Node.js scripts.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-sm flex items-start gap-4">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shrink-0">STEP 03</span>
              <div className="space-y-1">
                <h4 className="font-bold text-arena-text text-sm font-sans">Hidden Test Case Evaluation</h4>
                <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                  The compiled binary is executed inside isolated processes against authoritative hidden test suites. Test case inputs and expected outputs are never transmitted to the browser client.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-arena-border bg-white shadow-sm flex items-start gap-4">
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold shrink-0">STEP 04</span>
              <div className="space-y-1">
                <h4 className="font-bold text-arena-text text-sm font-sans">Verdict Finalization & Transaction Commit</h4>
                <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                  The final status (<code className="text-emerald-700 font-bold">ACCEPTED</code>, <code className="text-rose-700 font-bold">WRONG_ANSWER</code>, <code className="text-amber-700 font-bold">TIME_LIMIT_EXCEEDED</code>, <code className="text-purple-700 font-bold">RUNTIME_ERROR</code>) is written atomically to PostgreSQL alongside runtime (ms) and memory (KB) metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Competitive Elo Rating Engine & Anti-Farming Logic */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-arena-border pb-3">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-arena-text flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>3. Competitive Elo Rating Math & Anti-Farming Protocol</span>
            </h2>
            <span className="text-xs font-mono text-arena-muted hidden sm:inline">Persisted Rating Rules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-4">
              <h3 className="font-heading font-bold text-arena-text text-base font-sans">Elo Calculation Formula</h3>
              <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                New coders initialize at <strong>1200 Elo Base</strong>. Upon achieving an <code className="text-emerald-700 font-bold">ACCEPTED</code> verdict on a previously unsolved problem, the potential rating gain is computed based on problem difficulty vs current user rating:
              </p>
              <div className="p-4 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple font-mono text-[11px] leading-relaxed font-bold">
                ΔElo = K × (1 - E)<br />
                E = 1 / (1 + 10^((Rating_Problem - Rating_User) / 400))
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-4">
              <h3 className="font-heading font-bold text-arena-text text-base font-sans flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-arena-purple" />
                <span>Anti-Farming Protection</span>
              </h3>
              <p className="text-arena-text-secondary font-sans text-xs leading-relaxed">
                To prevent competitive rating manipulation, the backend verifies existing database records before awarding Elo delta points:
              </p>
              <ul className="space-y-2 text-arena-text font-sans text-xs list-disc list-inside">
                <li><strong>First Acceptance Only</strong>: Rating delta is only awarded when a problem transitions from unsolved to solved.</li>
                <li><strong>Re-Solve Protection</strong>: Re-submitting code to an already ACCEPTED problem results in <strong>+0 Elo</strong>.</li>
                <li><strong>History Auditing</strong>: Every rating update creates an immutable audit row in the PostgreSQL <code className="text-arena-purple font-bold">rating_history</code> table.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Code DNA Developer Intelligence */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-arena-border pb-3">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-arena-text flex items-center gap-2.5">
              <Dna className="h-5 w-5 text-arena-purple" />
              <span>4. Code DNA Skill Intelligence Engine</span>
            </h2>
            <span className="text-xs font-mono text-arena-muted hidden sm:inline">Algorithmic Pattern Analysis</span>
          </div>

          <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-4">
            <p className="text-arena-text-secondary font-sans text-xs leading-relaxed max-w-3xl">
              Code DNA models algorithmic skill patterns across major computer science topics (Arrays, Trees, Graphs, Dynamic Programming, Strings, Hash Tables). Every accepted solution updates your topic mastery matrix:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                <span className="text-[10px] uppercase font-sans text-emerald-700 block font-semibold">Primary Strength</span>
                <strong className="text-arena-text text-sm block">Arrays & Hash Tables</strong>
                <span className="text-[11px] block">High Acceptance & Speed</span>
              </div>

              <div className="p-4 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple space-y-1">
                <span className="text-[10px] uppercase font-sans text-arena-purple block font-semibold">Developing Topic</span>
                <strong className="text-arena-text text-sm block">Binary Trees</strong>
                <span className="text-[11px] block">61% Mastery Score</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                <span className="text-[10px] uppercase font-sans text-amber-700 block font-semibold">Target Weak Point</span>
                <strong className="text-arena-text text-sm block">Graphs & BFS/DFS</strong>
                <span className="text-[11px] block">29% Mastery Score</span>
              </div>

              <div className="p-4 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple space-y-1">
                <span className="text-[10px] uppercase font-sans text-arena-purple block font-semibold">Training Target</span>
                <strong className="text-arena-text text-sm block">Number of Islands</strong>
                <span className="text-[11px] block">Recommended Challenge</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <div className="p-8 rounded-3xl border border-arena-purple-light bg-gradient-to-r from-white via-arena-surface-purple to-white shadow-purple-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-heading font-extrabold text-arena-text">Ready to test your code?</h3>
            <p className="text-xs text-arena-text-secondary">Explore problem challenges or log in to view your Code DNA profile.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/problems"
              className="px-6 py-3 rounded-xl bg-arena-purple text-white font-heading font-extrabold text-xs hover:bg-arena-purple-hover transition-all shadow-purple"
            >
              Explore Problems
            </Link>
            <Link
              to="/auth/register"
              className="px-6 py-3 rounded-xl border border-arena-border bg-white text-xs font-heading font-extrabold text-arena-text hover:border-arena-purple transition-all shadow-sm"
            >
              Register Profile
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs font-mono text-arena-text-secondary py-6 border-t border-arena-border">
        <span>CodeAscend Platform Architecture • Spring Boot 3 + PostgreSQL + Kafka + React 18</span>
      </footer>
    </div>
  );
}
