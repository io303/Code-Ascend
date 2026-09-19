import { Cpu, Server, Database, Layers, Code, FileCode, Box, Shield, Zap, Terminal, Package, GitBranch } from "lucide-react";

type TechItem = {
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
};

const technologies: TechItem[] = [
  { name: "Spring Boot", category: "Backend Engine", icon: Server, color: "text-emerald-500" },
  { name: "Java 21", category: "Core Language", icon: Cpu, color: "text-amber-500" },
  { name: "PostgreSQL", category: "Database", icon: Database, color: "text-blue-500" },
  { name: "Redis", category: "Caching & ZSET", icon: Layers, color: "text-red-500" },
  { name: "Apache Kafka", category: "Event Pipeline", icon: Zap, color: "text-purple-500" },
  { name: "React 18", category: "Frontend UI", icon: Code, color: "text-sky-400" },
  { name: "TypeScript", category: "Type Safety", icon: FileCode, color: "text-blue-600" },
  { name: "Tailwind CSS", category: "Design System", icon: Box, color: "text-cyan-400" },
  { name: "Monaco Editor", category: "IDE Engine", icon: Terminal, color: "text-indigo-400" },
  { name: "Docker", category: "Sandbox Runner", icon: Box, color: "text-blue-400" },
  { name: "JWT Auth", category: "Security", icon: Shield, color: "text-emerald-400" },
  { name: "Vite", category: "Build Tool", icon: Zap, color: "text-amber-400" },
  { name: "Apache Maven", category: "Build System", icon: Package, color: "text-rose-500" },
  { name: "GitHub", category: "Version Control", icon: GitBranch, color: "text-slate-800" },
];

export function TechMarquee() {
  return (
    <section className="py-16 bg-[#FAFAFA] border-y border-arena-border relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-3 mb-10">
        <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-arena-purple">
          POWERING MODERN DEVELOPERS
        </h3>
        <p className="text-sm font-heading font-extrabold text-arena-text sm:text-base">
          Built using industry-standard technologies.
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full overflow-hidden group">
        {/* Gradient Fades on Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

        {/* Moving Track */}
        <div className="flex w-max animate-marquee space-x-6 group-hover:[animation-play-state:paused]">
          {[...technologies, ...technologies].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={`${tech.name}-${idx}`}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-arena-border bg-white shadow-sm filter grayscale opacity-70 hover:filter-none hover:opacity-100 hover:scale-105 hover:border-arena-purple-light hover:shadow-purple-sm transition-all duration-300 cursor-pointer shrink-0 select-none"
              >
                <div className={`p-2 rounded-xl bg-arena-surface-subtle ${tech.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left font-mono">
                  <span className="block text-xs font-bold text-arena-text leading-tight">{tech.name}</span>
                  <span className="block text-[10px] text-arena-text-secondary">{tech.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tailwind CSS Marquee Animation Utility */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
