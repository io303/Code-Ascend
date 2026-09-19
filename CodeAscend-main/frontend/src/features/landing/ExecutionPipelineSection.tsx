import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Send,
  Cpu,
  CheckCircle2,
  Trophy,
  Dna,
  Sparkles,
  Play,
  ArrowRight,
  Terminal,
  Activity,
  Zap,
  ShieldCheck,
  Layers,
  Server
} from "lucide-react";

type NodeKey = "code" | "kafka" | "sandbox" | "compiler" | "runner" | "evaluator" | "accepted" | "elo" | "ai";

interface NodeTooltipInfo {
  title: string;
  subtitle: string;
  description: string;
}

const NODE_TOOLTIPS: Record<NodeKey, NodeTooltipInfo> = {
  code: {
    title: "Monaco Code Editor",
    subtitle: "Frontend Source Entry",
    description: "Source code written in Monaco with real-time syntax verification and starter templates.",
  },
  kafka: {
    title: "Kafka Event Broker",
    subtitle: "Asynchronous Pipeline",
    description: "Submissions are serialized and published as low-latency Kafka events to high-throughput queues.",
  },
  sandbox: {
    title: "Isolated Container Sandbox",
    subtitle: "Security & Isolation",
    description: "User code executes inside isolated containers with strictly enforced CPU, memory, and wall-clock limits.",
  },
  compiler: {
    title: "Binary Target Compiler",
    subtitle: "Multi-Language Toolchain",
    description: "Compiles binary targets using g++ -O2, javac, or native runtimes with zero overhead.",
  },
  runner: {
    title: "Test Case Execution Engine",
    subtitle: "Validation Suite",
    description: "Evaluates your executable binary against visible samples and authoritative hidden test cases.",
  },
  evaluator: {
    title: "Verdict & Metric Evaluator",
    subtitle: "Correctness & Benchmark",
    description: "Strictly compares stdout, execution runtime, and peak RSS memory consumption against constraints.",
  },
  accepted: {
    title: "ACCEPTED Verdict",
    subtitle: "Passed Test Suite",
    description: "All test cases matched expected output within memory and time limits.",
  },
  elo: {
    title: "Deterministic Elo Engine",
    subtitle: "Competitive Rating",
    description: "First accepted solutions update your competitive rating with strict anti-farming protection.",
  },
  ai: {
    title: "AI Post-Solve Coach",
    subtitle: "Pattern & Complexity Analysis",
    description: "Post-solve analysis identifies algorithmic complexity and maps your evolving Code DNA profile.",
  },
};

export function ExecutionPipelineSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<NodeKey | null>(null);

  // Auto-looping 9-second animation sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 7);
    }, 1300);
    return () => clearInterval(timer);
  }, []);

  const getStepProgress = (stepIndex: number) => activeStep >= stepIndex;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto bg-arena-bg relative overflow-hidden font-sans">
      
      {/* Radial Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] bg-[radial-gradient(circle_at_center,rgba(139,61,255,0.05)_0,transparent_70%)] pointer-events-none z-0" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 relative z-10 border-b border-arena-border">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
            <Terminal className="h-3.5 w-3.5" />
            <span>REAL EVALUATION PIPELINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-arena-text tracking-tight">
            NOT JUST AN EDITOR.
          </h2>

          <p className="text-xs sm:text-sm text-arena-text-secondary max-w-2xl leading-relaxed">
            Your submission moves through a real evaluation pipeline. Isolated execution, hidden test suites, deterministic Elo updates, and deep skill intelligence.
          </p>
        </div>

        {/* DEMO PIPELINE System Status Badge */}
        <div className="p-4 rounded-2xl border border-arena-border bg-white shadow-float font-mono text-xs space-y-2 shrink-0 self-start md:self-auto">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-bold text-arena-muted uppercase tracking-wider">DEMO PIPELINE</span>
            <span className="inline-flex items-center gap-1.5 text-arena-accepted font-bold">
              <span className="h-2 w-2 rounded-full bg-arena-accepted animate-pulse" />
              <span>Judge Online</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 text-center border-t border-arena-border text-[11px]">
            <div>
              <span className="text-arena-muted block text-[10px]">Queue</span>
              <span className="text-arena-text font-bold">1</span>
            </div>
            <div className="border-x border-arena-border px-2">
              <span className="text-arena-muted block text-[10px]">Workers</span>
              <span className="text-arena-text font-bold">4</span>
            </div>
            <div>
              <span className="text-arena-muted block text-[10px]">Latency</span>
              <span className="text-arena-purple font-bold">118ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Tooltip Overlay Banner */}
      <div className="my-6 min-h-[52px] relative z-20">
        <AnimatePresence mode="wait">
          {hoveredNode ? (
            <motion.div
              key={hoveredNode}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="p-3.5 rounded-2xl border border-arena-purple-light bg-arena-surface-purple shadow-purple-sm text-xs font-mono flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-arena-purple" />
                <span className="text-arena-text font-bold">{NODE_TOOLTIPS[hoveredNode].title}</span>
                <span className="text-arena-text-secondary font-sans text-xs hidden sm:inline">— {NODE_TOOLTIPS[hoveredNode].description}</span>
              </div>
              <span className="text-arena-purple text-[11px] font-bold shrink-0">{NODE_TOOLTIPS[hoveredNode].subtitle}</span>
            </motion.div>
          ) : (
            <div className="p-3.5 rounded-2xl border border-arena-border bg-white text-xs font-mono text-arena-muted flex items-center gap-2 shadow-sm">
              <Activity className="h-4 w-4 text-arena-purple" />
              <span>Hover any pipeline node to inspect technical component specifications.</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* DESKTOP PIPELINE VISUALIZATION GRID */}
      <div className="hidden lg:grid grid-cols-12 gap-6 items-stretch relative z-10">
        
        {/* Left Column (4 cols): Developer Editor Panel (Dark Charcoal Code Card for IDE feel) */}
        <div className="col-span-4 rounded-3xl border border-arena-dark bg-arena-dark-card p-5 shadow-card space-y-4 flex flex-col justify-between"
             onMouseEnter={() => setHoveredNode("code")}
             onMouseLeave={() => setHoveredNode(null)}>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-white font-bold ml-1">TwoSum.cpp</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-arena-dark border border-gray-700 text-arena-purple-soft font-bold">C++ 20</span>
            </div>

            <pre className="p-3.5 rounded-2xl bg-arena-dark font-mono text-[11px] text-purple-200 leading-relaxed border border-gray-800 overflow-x-auto">
{`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (mp.count(diff)) 
            return {mp[diff], i};
        mp[nums[i]] = i;
    }
    return {};
}`}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-2 border-t border-gray-800">
            <div className="p-2 rounded-xl bg-arena-dark border border-gray-800 text-center">
              <span className="text-gray-400 block text-[10px]">Time Complexity</span>
              <span className="text-white font-bold">O(N)</span>
            </div>
            <div className="p-2 rounded-xl bg-arena-dark border border-gray-800 text-center">
              <span className="text-gray-400 block text-[10px]">Space Complexity</span>
              <span className="text-white font-bold">O(N)</span>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Animated Flow Pipeline */}
        <div className="col-span-4 rounded-3xl border border-arena-border bg-white p-5 shadow-card flex flex-col justify-between font-mono text-xs space-y-3 relative overflow-hidden">
          
          <div className="text-center pb-2 border-b border-arena-border">
            <span className="text-xs font-heading font-bold text-arena-text uppercase tracking-wider">EXECUTION ENGINE</span>
          </div>

          {/* Node 1: KAFKA */}
          <div
            onMouseEnter={() => setHoveredNode("kafka")}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              getStepProgress(1)
                ? "border-arena-purple bg-arena-surface-purple text-arena-purple shadow-purple-sm"
                : "border-arena-border bg-arena-surface-subtle text-arena-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Send className="h-4 w-4" />
              <span className="font-bold text-arena-text">1. KAFKA QUEUE</span>
            </div>
            <span className="text-[10px] opacity-80">topic: submission-events</span>
          </div>

          {/* Connected Data Flow Connector 1 -> 2 */}
          <div className="h-4 flex items-center justify-center">
            <div className={`h-full w-0.5 transition-colors duration-300 ${getStepProgress(2) ? "bg-arena-purple shadow-purple-sm" : "bg-arena-border"}`} />
          </div>

          {/* Node 2: SANDBOX & COMPILE */}
          <div
            onMouseEnter={() => setHoveredNode("sandbox")}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              getStepProgress(2)
                ? "border-arena-purple bg-arena-surface-purple text-arena-purple shadow-purple-sm"
                : "border-arena-border bg-arena-surface-subtle text-arena-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Code2 className="h-4 w-4" />
              <span className="font-bold text-arena-text">2. SANDBOX & COMPILE</span>
            </div>
            <span className="text-[10px] opacity-80">g++ -O2 Target</span>
          </div>

          {/* Connected Data Flow Connector 2 -> 3 */}
          <div className="h-4 flex items-center justify-center">
            <div className={`h-full w-0.5 transition-colors duration-300 ${getStepProgress(3) ? "bg-arena-purple shadow-purple-sm" : "bg-arena-border"}`} />
          </div>

          {/* Node 3: TEST RUNNER */}
          <div
            onMouseEnter={() => setHoveredNode("runner")}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              getStepProgress(3)
                ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                : "border-arena-border bg-arena-surface-subtle text-arena-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Play className="h-4 w-4" />
              <span className="font-bold text-arena-text">3. TEST RUNNER</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700">
              {getStepProgress(3) ? `${Math.min(4, activeStep - 1)}/4 Tested` : "Idle"}
            </span>
          </div>

          {/* Connected Data Flow Connector 3 -> 4 */}
          <div className="h-4 flex items-center justify-center">
            <div className={`h-full w-0.5 transition-colors duration-300 ${getStepProgress(4) ? "bg-arena-purple shadow-purple-sm" : "bg-arena-border"}`} />
          </div>

          {/* Node 4: EVALUATOR */}
          <div
            onMouseEnter={() => setHoveredNode("evaluator")}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              getStepProgress(4)
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-arena-border bg-arena-surface-subtle text-arena-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-bold text-arena-text">4. EVALUATOR</span>
            </div>
            <span className="text-[10px] opacity-80">Output Verified</span>
          </div>
        </div>

        {/* Right Column (4 cols): Live Result & AI Analysis Panel */}
        <div className="col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Verdict Card */}
          <div
            onMouseEnter={() => setHoveredNode("accepted")}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-5 rounded-3xl border transition-all duration-300 space-y-3 font-mono text-xs ${
              getStepProgress(5)
                ? "border-emerald-200 bg-emerald-50/80 shadow-sm"
                : "border-arena-border bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> ✓ ACCEPTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                4 / 4 Passed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200 text-[11px]">
              <div>
                <span className="text-arena-muted block text-[10px]">Runtime</span>
                <span className="text-arena-text font-bold">118 ms</span>
              </div>
              <div>
                <span className="text-arena-muted block text-[10px]">Memory</span>
                <span className="text-arena-text font-bold">20.4 MB</span>
              </div>
            </div>
          </div>

          {/* Elo & AI Card */}
          <div
            onMouseEnter={() => setHoveredNode("elo")}
            onMouseLeave={() => setHoveredNode(null)}
            className={`p-5 rounded-3xl border transition-all duration-300 space-y-3 font-mono text-xs ${
              getStepProgress(6)
                ? "border-arena-purple-light bg-arena-surface-purple shadow-purple-sm"
                : "border-arena-border bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-arena-text flex items-center gap-2 font-sans">
                <Trophy className="h-4 w-4 text-arena-purple" /> Rating Change
              </span>
              <span className="text-arena-purple font-extrabold text-sm">+18 Elo</span>
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-arena-border text-[11px]">
              <span className="text-arena-muted">Competitor Rating</span>
              <span className="text-arena-text font-bold">1200 → <strong className="text-arena-purple">1218 Elo</strong></span>
            </div>

            <div
              onMouseEnter={(e) => { e.stopPropagation(); setHoveredNode("ai"); }}
              onMouseLeave={() => setHoveredNode(null)}
              className="p-3 rounded-2xl bg-white border border-arena-purple-light space-y-1 text-[11px] shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-arena-purple font-bold">
                <Sparkles className="h-3.5 w-3.5" /> AI Skill Diagnosis
              </div>
              <p className="text-arena-text">Strongest: <strong className="text-emerald-600">Arrays & Hash Tables</strong></p>
              <p className="text-arena-text">Next Target: <strong className="text-arena-purple">Binary Tree Right View</strong></p>
            </div>
          </div>
        </div>

      </div>

      {/* MOBILE RESPONSIVE ALTERNATIVE: Clean Vertical Pipeline */}
      <div className="block lg:hidden space-y-4 font-mono text-xs pt-4">
        <div className="p-4 rounded-2xl border border-arena-border bg-white space-y-1 shadow-sm">
          <span className="text-arena-purple font-bold">01. CODE ENTRY</span>
          <p className="text-arena-text font-bold">Monaco Editor • TwoSum.cpp (C++20)</p>
          <p className="text-arena-text-secondary text-[11px] font-sans">Source code verified with real-time syntax checking.</p>
        </div>

        <div className="p-4 rounded-2xl border border-arena-purple-light bg-arena-surface-purple space-y-1 shadow-sm">
          <span className="text-arena-purple font-bold">02. ASYNC KAFKA QUEUE</span>
          <p className="text-arena-text font-bold">Topic: submission-events</p>
          <p className="text-arena-text-secondary text-[11px] font-sans">Serialized payloads dispatched to judge worker nodes.</p>
        </div>

        <div className="p-4 rounded-2xl border border-arena-purple-light bg-arena-surface-purple space-y-1 shadow-sm">
          <span className="text-arena-purple font-bold">03. CONTAINER SANDBOX & COMPILE</span>
          <p className="text-arena-text font-bold">g++ -O2 Binary Target</p>
          <p className="text-arena-text-secondary text-[11px] font-sans">Isolated sandbox with strict CPU & memory enforcement.</p>
        </div>

        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 space-y-1 shadow-sm">
          <span className="text-amber-700 font-bold">04. TEST RUNNER & EVALUATOR</span>
          <p className="text-arena-text font-bold">4 / 4 Test Cases Passed</p>
          <p className="text-arena-text-secondary text-[11px] font-sans">Output, execution runtime (118ms), and memory benchmarked.</p>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50 space-y-2 shadow-sm">
          <span className="text-emerald-700 font-bold">05. VERDICT & RATING UPDATE</span>
          <div className="flex items-center justify-between text-arena-text font-bold text-sm">
            <span className="text-emerald-700">✓ ACCEPTED</span>
            <span className="text-arena-purple">+18 Elo Gained</span>
          </div>
          <p className="text-arena-text-secondary text-[11px] font-sans">Elo rating updated deterministically; Code DNA profile generated.</p>
        </div>
      </div>

      {/* Bottom 3 Engineering Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 mt-12 border-t border-arena-border relative z-10">
        <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-2 hover:border-arena-purple-soft transition-all">
          <div className="h-10 w-10 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple flex items-center justify-center mb-3">
            <Send className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-bold text-arena-text text-base">ASYNC JUDGING</h3>
          <p className="text-xs text-arena-text-secondary leading-relaxed font-sans">
            Kafka-powered submission event queue decouples web requests from heavy judge execution workers.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-2 hover:border-arena-purple-soft transition-all">
          <div className="h-10 w-10 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple flex items-center justify-center mb-3">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-bold text-arena-text text-base">MULTI-LANGUAGE EXECUTION</h3>
          <p className="text-xs text-arena-text-secondary leading-relaxed font-sans">
            Supports C++20, Python 3, Java 21, and Node.js with native compilation targets and memory limits.
          </p>
        </div>

        <div className="p-6 rounded-3xl border border-arena-border bg-white shadow-card space-y-2 hover:border-arena-purple-soft transition-all">
          <div className="h-10 w-10 rounded-2xl bg-arena-surface-purple border border-arena-purple-light text-arena-purple flex items-center justify-center mb-3">
            <Trophy className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-bold text-arena-text text-base">COMPETITIVE RATING</h3>
          <p className="text-xs text-arena-text-secondary leading-relaxed font-sans">
            Persistent Elo rating history derived from real problem solves with strict anti-farming verification.
          </p>
        </div>
      </div>
    </section>
  );
}
