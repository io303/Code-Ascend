import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, AlertCircle, ChevronRight } from "lucide-react";

export function AiFailureSection() {
  const [showHint, setShowHint] = useState<boolean>(false);

  return (
    <section id="ai" className="py-16 sm:py-20 px-6 relative overflow-hidden bg-gradient-to-b from-arena-surface-purple/30 to-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
            <Bot className="h-3.5 w-3.5 text-arena-purple" />
            <span>AI Failure Diagnostics</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-arena-text tracking-tight leading-tight">
            DON'T JUST GET THE ANSWER. <br />
            <span className="text-arena-purple">UNDERSTAND THE FAILURE.</span>
          </h2>
          <p className="text-sm text-arena-text-secondary">
            When your submission encounters WA, TLE, or RE, CodeAscend's AI assistant pins the exact failure line and delivers progressive hints.
          </p>
        </div>

        {/* Split Editor + AI Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Code Editor with Failure Highlight (Kept dark charcoal for code IDE realism) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-700 bg-[#1E1E2E] p-5 shadow-card space-y-3 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 text-slate-400">
              <span className="text-white font-bold">BinarySearch.cpp</span>
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Line 14 Overflow
              </span>
            </div>

            <div className="space-y-1 text-left bg-[#181825] p-4 rounded-2xl border border-slate-800">
              <p className="text-slate-500">12 | while (low &lt;= high) &#123;</p>
              <p className="text-slate-500">13 |     // Problematic integer calculation</p>
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold flex items-center justify-between">
                <span>14 |     int mid = (low + high) / 2;</span>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-md">OVERFLOW</span>
              </div>
              <p className="text-slate-500">15 |     if (nums[mid] == target) return mid;</p>
              <p className="text-slate-500">16 | &#125;</p>
            </div>
          </div>

          {/* Right AI Diagnostics Card */}
          <div className="lg:col-span-6 rounded-3xl border border-arena-purple-light bg-arena-surface-purple p-6 shadow-purple-sm space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-arena-purple-light pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-arena-purple" />
                <span className="font-heading font-bold text-arena-text text-base">WHY DID THIS FAIL?</span>
              </div>
              <span className="text-xs font-mono text-arena-purple bg-white px-3 py-1 rounded-full border border-arena-purple-light font-bold">
                Time Limit Exceeded / RE
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <p className="text-arena-text">
                <strong>Diagnostic:</strong> <span className="text-rose-700 font-bold">Integer overflow at Line 14</span> when <code className="text-arena-purple font-bold">low + high &gt; 2<sup>31</sup> - 1</code>.
              </p>
              <p className="text-arena-text-secondary">
                Adding two large 32-bit positive integers causes signed integer wrap-around to negative values, resulting in out-of-bounds array access.
              </p>
            </div>

            {/* Progressive Hint Reveal */}
            <div className="pt-2">
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2.5 rounded-2xl bg-arena-purple text-white text-xs font-mono font-bold hover:bg-arena-purple-hover transition-all flex items-center gap-2 shadow-purple"
                >
                  <span>SHOW PROGRESSIVE HINT</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50 font-mono text-xs space-y-2 text-emerald-900"
                >
                  <span className="font-bold uppercase tracking-wider block text-[10px] text-emerald-700">
                    ✓ Recommended Solution Formula
                  </span>
                  <p className="text-emerald-950 font-bold">
                    <code>int mid = low + (high - low) / 2;</code>
                  </p>
                  <p className="text-emerald-800 text-[11px]">
                    Prevents integer overflow by performing subtraction before addition.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Section 7 — Engineering Depth Diagram */}
        <div className="pt-12 max-w-5xl mx-auto space-y-6 text-center font-sans border-t border-arena-border">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-arena-purple uppercase tracking-wider block">SYSTEM ARCHITECTURE</span>
            <h3 className="text-3xl font-heading font-extrabold text-arena-text">BUILT BEYOND THE EDITOR.</h3>
            <p className="text-xs text-arena-text-secondary max-w-xl mx-auto">
              CodeAscend is backed by an event-driven Kafka pipeline, multi-language sandbox judge, and persistent PostgreSQL + Redis data storage.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs text-left">
            <div className="p-3.5 rounded-2xl border border-arena-border bg-white shadow-sm space-y-1">
              <span className="text-[10px] text-arena-muted font-bold block">FRONTEND</span>
              <strong className="block font-bold text-arena-text">React + Monaco</strong>
            </div>
            <div className="p-3.5 rounded-2xl border border-arena-border bg-white shadow-sm space-y-1">
              <span className="text-[10px] text-arena-muted font-bold block">BACKEND</span>
              <strong className="block font-bold text-arena-text">Spring Boot</strong>
            </div>
            <div className="p-3.5 rounded-2xl border border-arena-border bg-white shadow-sm space-y-1">
              <span className="text-[10px] text-arena-muted font-bold block">EVENT BUS</span>
              <strong className="block font-bold text-arena-text">Apache Kafka</strong>
            </div>
            <div className="p-3.5 rounded-2xl border border-arena-border bg-white shadow-sm space-y-1">
              <span className="text-[10px] text-arena-muted font-bold block">JUDGE ENGINE</span>
              <strong className="block font-bold text-arena-text">Multi-Lang Sandbox</strong>
            </div>
            <div className="p-3.5 rounded-2xl border border-arena-border bg-white shadow-sm space-y-1">
              <span className="text-[10px] text-arena-muted font-bold block">TEST SUITE</span>
              <strong className="block font-bold text-arena-text">Test Evaluator</strong>
            </div>
            <div className="p-3.5 rounded-2xl border border-arena-purple-light bg-arena-surface-purple shadow-purple-sm space-y-1">
              <span className="text-[10px] text-arena-purple font-bold block">DATABASE</span>
              <strong className="block font-bold text-arena-purple">PostgreSQL</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
