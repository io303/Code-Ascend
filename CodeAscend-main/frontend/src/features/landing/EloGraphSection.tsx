import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export function EloGraphSection() {
  const eloHistoryData = [
    { solve: "Initial", rating: 1200, tier: "Novice" },
    { solve: "Solve #1 (Easy)", rating: 1218, tier: "Novice" },
    { solve: "Solve #2 (Easy)", rating: 1234, tier: "Novice" },
    { solve: "Solve #3 (Medium)", rating: 1259, tier: "Competitor" },
    { solve: "Solve #4 (Medium)", rating: 1281, tier: "Competitor" },
    { solve: "Solve #5 (Hard)", rating: 1318, tier: "Competitor" },
    { solve: "Solve #6 (Hard)", rating: 1354, tier: "Competitor" },
    { solve: "Solve #7 (Hard)", rating: 1410, tier: "Master" },
  ];

  return (
    <section id="elo" className="py-16 sm:py-20 px-6 relative overflow-hidden bg-gradient-to-b from-white to-arena-surface-purple/40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-xs font-mono font-bold text-amber-800 select-none cursor-default">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Competitive Skill Ranking</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-arena-text tracking-tight leading-tight">
            EVERY ACCEPTED SOLUTION MOVES YOU FORWARD.
          </h2>

          <p className="text-sm text-arena-text-secondary leading-relaxed">
            Every competitor starts at <strong>1200 Elo</strong>. Ratings update deterministically based on problem difficulty and current rank ($K=32$). Re-solving the same problem awards 0 rating delta to strictly prevent farming.
          </p>

          <div className="space-y-3 font-mono text-xs text-arena-text">
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-arena-border bg-white shadow-card">
              <span className="h-2.5 w-2.5 rounded-full bg-arena-purple" />
              <span>Base Rating: <strong>1200 Elo</strong></span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-arena-border bg-white shadow-card">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <span>Anti-Farming: <strong>Only 1st AC awards Elo</strong></span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-arena-border bg-white shadow-card">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
              <span>Leaderboard: <strong>PostgreSQL + Redis ZSET</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column 3D Perspective Chart */}
        <div className="lg:col-span-7 [perspective:1000px]">
          <motion.div
            initial={{ rotateX: 10, rotateY: -10, opacity: 0 }}
            whileInView={{ rotateX: 0, rotateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-arena-purple-light bg-white p-6 shadow-purple-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-arena-border pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-arena-purple" />
                <span className="font-heading font-bold text-arena-text text-base">Sample Competitive Rating Progression</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-arena-surface-purple text-arena-purple border border-arena-purple-light">
                1200 → 1410 Elo
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eloHistoryData}>
                  <XAxis dataKey="solve" stroke="#5F5F6B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#5F5F6B" fontSize={11} tickLine={false} domain={[1180, 1450]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E2EA", borderRadius: "14px", color: "#171717" }}
                  />
                  <Line type="monotone" dataKey="rating" stroke="#8B3DFF" strokeWidth={3.5} dot={{ fill: "#8B3DFF", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center pt-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 block">Easy AC</span>
                <strong className="text-emerald-800">+18 Elo</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-700 block">Medium AC</span>
                <strong className="text-amber-800 font-bold">+25 Elo</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] text-purple-700 block">Hard AC</span>
                <strong className="text-purple-800 font-bold">+36 Elo</strong>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
