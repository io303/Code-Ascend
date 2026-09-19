import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu, Trophy, Dna, GitPullRequest } from "lucide-react";

export function WhyCodeAscendSection() {
  const features = [
    {
      title: "Asynchronous Kafka Judge",
      desc: "Submissions are queued asynchronously via Apache Kafka and evaluated in isolated sandbox workers.",
      icon: Cpu,
      tag: "INFRASTRUCTURE",
    },
    {
      title: "Deterministic Elo Rating",
      desc: "Anti-farming rating calculations ($K=32$) award rating delta only on first accepted solve.",
      icon: Trophy,
      tag: "COMPETITIVE ENGINE",
    },
    {
      title: "Multi-Language Sandbox",
      desc: "Native support for C++20, Python 3, Java 21, and Node.js JavaScript with strict memory & CPU limits.",
      icon: Zap,
      tag: "EXECUTION ENGINE",
    },
    {
      title: "Proprietary Code DNA",
      desc: "Deep skill intelligence categorizing topic breakdown across Arrays, Trees, Graphs, and DP.",
      icon: Dna,
      tag: "SKILL DIAGNOSTICS",
    },
    {
      title: "Hidden Test Suite Engine",
      desc: "Edge cases, large dataset inputs, and strict time limits prevent hardcoded submissions.",
      icon: ShieldCheck,
      tag: "EVALUATION ACCURACY",
    },
    {
      title: "Real Telemetry Analytics",
      desc: "Persisted PostgreSQL telemetry tracking 365-day activity heatmaps, acceptance rate, and rating journey.",
      icon: GitPullRequest,
      tag: "PERSISTED DATA",
    },
  ];

  return (
    <section className="py-20 px-6 bg-arena-bg relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
            <Zap className="h-3.5 w-3.5 text-arena-purple" />
            <span>BUILT DIFFERENTLY</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-heading font-extrabold text-arena-text tracking-tight">
            WHY CODEASCEND.
          </h2>

          <p className="text-sm sm:text-base text-arena-text-secondary leading-relaxed">
            Not another simple web editor wrapper. CodeAscend is backed by real distributed systems engineering.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 sm:p-8 rounded-3xl border border-arena-border bg-white shadow-card hover:border-arena-purple-light hover:shadow-purple-sm transition-all text-left flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-arena-purple uppercase tracking-wider bg-arena-surface-purple px-2.5 py-1 rounded-full border border-arena-purple-light">
                      {f.tag}
                    </span>
                    <div className="h-10 w-10 rounded-2xl bg-arena-surface-subtle border border-arena-border flex items-center justify-center text-arena-purple group-hover:bg-arena-purple group-hover:text-white transition-all shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-extrabold text-arena-text group-hover:text-arena-purple transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-xs text-arena-text-secondary leading-relaxed font-sans">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
