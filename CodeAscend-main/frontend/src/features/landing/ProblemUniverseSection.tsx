import { motion } from "framer-motion";
import { Dna, ArrowRight, CheckCircle2, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function ProblemUniverseSection() {
  const topics = [
    { name: "Arrays & Hashing", level: 88, status: "STRONGEST", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { name: "Trees & Binary Search", level: 78, status: "MASTERED", color: "text-purple-600 bg-purple-50 border-purple-200" },
    { name: "Dynamic Programming", level: 64, status: "IMPROVING", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { name: "Graphs & Traversals", level: 42, status: "TRAIN NEXT", color: "text-arena-purple bg-arena-surface-purple border-arena-purple-light" },
  ];

  return (
    <section id="problems" className="py-16 sm:py-20 px-6 relative overflow-hidden bg-white font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
            <Dna className="h-3.5 w-3.5 text-arena-purple" />
            <span>SIGNATURE FEATURE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-arena-text tracking-tight">
            KNOW HOW YOU CODE.
          </h2>
          <p className="text-sm text-arena-text-secondary">
            CodeAscend tracks your algorithm topic breakdown, solution runtime efficiency, and identifies exactly where to focus next.
          </p>
        </div>

        {/* Code DNA Interactive Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-arena-border bg-arena-bg p-6 sm:p-10 shadow-card">
          {/* Left Column: Topic Mastery Bars */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-arena-border pb-3">
              <span className="font-bold text-arena-text uppercase tracking-wider">Algorithmic Skill Breakdown</span>
              <span className="text-arena-text-secondary">Code DNA Intelligence</span>
            </div>

            <div className="space-y-4 pt-2">
              {topics.map((t) => (
                <div key={t.name} className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-arena-text">{t.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${t.color}`}>
                      {t.status} • {t.level}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-arena-border/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${t.level}%` }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="h-full rounded-full bg-arena-purple"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Code DNA Recommendations */}
          <div className="lg:col-span-5 space-y-4 bg-white p-6 rounded-2xl border border-arena-border shadow-sm">
            <div className="flex items-center gap-2 text-arena-purple font-mono text-xs font-bold uppercase tracking-wider">
              <Target className="h-4 w-4" />
              <span>Recommended Target</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-arena-text text-lg leading-snug">
                Network Delay Time (Dijkstra)
              </h3>
              <p className="text-xs text-arena-text-secondary leading-relaxed">
                Graph traversal problem tailored to boost your lowest topic score (+42% Graph Mastery).
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-arena-border text-xs font-mono">
              <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-bold border border-amber-200">
                MEDIUM • +24 ELO
              </span>
              <Link
                to="/problems"
                className="inline-flex items-center gap-1 font-bold text-arena-purple hover:underline"
              >
                <span>Solve Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
