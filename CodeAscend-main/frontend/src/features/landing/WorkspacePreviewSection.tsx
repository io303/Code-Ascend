import { motion } from "framer-motion";
import { Play, CheckCircle2, Code2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export function WorkspacePreviewSection() {
  return (
    <section className="py-20 px-6 bg-white border-y border-arena-border relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-arena-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
            <Code2 className="h-3.5 w-3.5 text-arena-purple" />
            <span>REALISTIC IDE WORKSPACE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-arena-text tracking-tight">
            ENGINEERED FOR SPEED.
          </h2>

          <p className="text-sm sm:text-base text-arena-text-secondary leading-relaxed">
            Experience an IDE designed specifically for competitive programmers. Dark Monaco editor, instant execution feedback, resizable viewports, and automated test case evaluation.
          </p>
        </div>

        {/* IDE Preview Card Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-arena-border bg-[#17171A] p-2 shadow-2xl max-w-6xl mx-auto overflow-hidden text-left"
        >
          {/* Mac OS Window Header Chrome */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1E1E22] border-b border-[#2E2E35] rounded-t-2xl font-mono text-xs text-[#9E9EA8]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
              <span className="ml-2 font-semibold text-white text-xs">CodeAscend Workspace — TwoSum.cpp</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                C++20 GCC 11
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-arena-purple/20 text-arena-purple-soft text-[11px] font-bold border border-arena-purple/30">
                1200 → 1218 Elo
              </span>
            </div>
          </div>

          {/* Inner Viewport Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#2E2E35] min-h-[420px]">
            {/* Left Panel: Problem Statement */}
            <div className="lg:col-span-5 p-6 bg-[#17171A] text-left space-y-4 text-xs font-mono text-[#D1D1D6]">
              <div className="flex items-center justify-between border-b border-[#2E2E35] pb-3">
                <span className="font-bold text-white text-sm font-sans">1. Two Sum</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  EASY
                </span>
              </div>

              <p className="text-[#A1A1AA] leading-relaxed font-sans">
                Given an array of integers <code className="text-arena-purple-soft">nums</code> and an integer <code className="text-arena-purple-soft">target</code>, return indices of the two numbers such that they add up to target.
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block">Sample Test Case</span>
                <div className="p-3 rounded-xl bg-[#1E1E22] border border-[#2E2E35] space-y-1 text-[11px]">
                  <p><span className="text-[#A1A1AA]">Input:</span> nums = [2,7,11,15], target = 9</p>
                  <p><span className="text-[#A1A1AA]">Output:</span> [0,1]</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-arena-purple/10 border border-arena-purple/20 text-arena-purple-soft text-[11px] font-sans flex items-center gap-2">
                <Trophy className="h-4 w-4 text-arena-purple-soft shrink-0" />
                <span>Solving awards <strong>+18 Elo rating</strong> towards Candidate Master tier.</span>
              </div>
            </div>

            {/* Right Panel: Monaco Code & Console Output */}
            <div className="lg:col-span-7 bg-[#1E1E22] p-5 flex flex-col justify-between text-xs font-mono text-left">
              {/* Code Snippet Display */}
              <div className="space-y-1.5 text-[#E4E4E7]">
                <p className="text-[#6E6E77]">// Optimal O(N) Hash Table Solution</p>
                <p><span className="text-purple-400">#include</span> <span className="text-emerald-400">&lt;iostream&gt;</span></p>
                <p><span className="text-purple-400">#include</span> <span className="text-emerald-400">&lt;unordered_map&gt;</span></p>
                <p><span className="text-purple-400">#include</span> <span className="text-emerald-400">&lt;vector&gt;</span></p>
                <br />
                <p><span className="text-blue-400">std::vector&lt;int&gt;</span> <span className="text-amber-300">twoSum</span>(<span className="text-blue-400">std::vector&lt;int&gt;&amp;</span> nums, <span className="text-blue-400">int</span> target) &#123;</p>
                <p className="pl-4"><span className="text-blue-400">std::unordered_map&lt;int, int&gt;</span> map;</p>
                <p className="pl-4"><span className="text-purple-400">for</span> (<span className="text-blue-400">int</span> i = 0; i &lt; nums.size(); ++i) &#123;</p>
                <p className="pl-8"><span className="text-blue-400">int</span> comp = target - nums[i];</p>
                <p className="pl-8"><span className="text-purple-400">if</span> (map.count(comp)) <span className="text-purple-400">return</span> &#123;map[comp], i&#125;;</p>
                <p className="pl-8">map[nums[i]] = i;</p>
                <p className="pl-4">&#125;</p>
                <p className="pl-4"><span className="text-purple-400">return</span> &#123;&#125;;</p>
                <p>&#125;</p>
              </div>

              {/* Console & Verdict Footer Bar */}
              <div className="pt-4 mt-4 border-t border-[#2E2E35] flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>ACCEPTED • 12/12 Tests Passed (118ms)</span>
                </div>

                <Link
                  to="/problems"
                  className="px-4 py-2 rounded-xl bg-arena-purple text-white font-heading font-extrabold text-xs hover:bg-arena-purple-hover transition-all shadow-purple flex items-center gap-1.5"
                >
                  <span>Try Interactive IDE</span>
                  <Play className="h-3 w-3 fill-current" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
