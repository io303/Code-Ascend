
import { motion } from "framer-motion";
import founderImage from "@/assets/founder.png";
import {
  CheckCircle2,
  GitBranch,
  Globe,
  Mail,
  Quote,
  Sparkles,
  ArrowUpRight,
  Cpu,
} from "lucide-react";

export function FounderSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const featureHighlights = [
    "Built from scratch",
    "Java + Spring Boot",
    "React + TypeScript",
    "JWT Authentication",
    "MySQL + Redis",
    "Docker-ready Architecture",
    "WebSocket Integration",
    "AI-Powered Features",
    "DSA & Competitive Programming",
  ];

  const techStack = [
    "Java",
    "Spring Boot",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "MySQL",
    "Redis",
    "Docker",
    "JWT",
    "WebSockets",
    "JPA / Hibernate",
    "Git",
    "GitHub",
    "Postman",
  ];

  return (
    <section
      id="founder"
      className="py-24 bg-[#0B1020] text-white relative overflow-hidden font-sans border-t border-[#1E293B]"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-arena-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* LEFT COLUMN: Founder Portrait & Bio Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-[#171E31]/80 backdrop-blur-xl border border-[#2A364F] rounded-3xl p-8 shadow-2xl space-y-6 text-center lg:text-left relative overflow-hidden group">

              {/* Top Edge Highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-arena-purple to-indigo-500" />

              {/* Portrait Container */}
              <div className="flex justify-center relative pt-2">

                {/* Soft Spotlight */}
                <div className="absolute inset-0 bg-arena-purple/25 rounded-full blur-2xl pointer-events-none transform scale-90" />

                {/* Floating Image Ring */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="relative z-10 p-[3px] rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-arena-purple shadow-xl cursor-pointer"
                >
                  <img
                    src={founderImage}
                    alt="Rahul Singh"
                    className="w-56 h-56 rounded-full object-cover bg-slate-950 block select-none"
                  />
                </motion.div>
              </div>

              {/* Bio & Credentials */}
              <div className="space-y-2 pt-2">
                <h3 className="font-heading font-extrabold text-2xl text-white tracking-tight">
                  Rahul Singh
                </h3>

                <p className="font-mono text-xs font-bold text-arena-purple-soft uppercase tracking-wider">
                  Founder & Full Stack Developer
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-mono text-slate-300">
                  <Cpu className="h-3.5 w-3.5 text-blue-400" />
                  <span>B.Tech IT — GL Bajaj</span>
                </div>
              </div>

              {/* Passion Bullets */}
              <div className="pt-2 border-t border-[#2A364F] space-y-2 font-mono text-xs text-slate-300 text-left">
                <span className="block font-bold text-[#94A3B8] uppercase tracking-wider text-[10px]">
                  Focused on
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span>Backend Engineering</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    <span>Spring Boot</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-arena-purple-soft" />
                    <span>DSA & Problem Solving</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>System Design</span>
                  </div>

                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-[#2A364F] grid grid-cols-2 gap-2">

                <motion.a
                  href="https://github.com/io303"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-arena-purple text-xs font-mono font-bold text-white transition-all group"
                >
                  <GitBranch className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                  <span>GitHub</span>
                </motion.a>

                <motion.a
                  href="#"
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-arena-purple text-xs font-mono font-bold text-white transition-all group"
                >
                  <Globe className="h-3.5 w-3.5 text-blue-400 group-hover:text-white" />
                  <span>Portfolio</span>
                </motion.a>

              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 space-y-8 text-left"
          >

            {/* Header */}
            <div className="space-y-4">

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple/40 bg-arena-purple/10 text-xs font-mono font-bold text-arena-purple-soft">
                <Sparkles className="h-3.5 w-3.5 text-arena-purple-soft" />
                <span>MEET THE CREATOR</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Built to learn. <br />

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-arena-purple-soft to-indigo-300">
                  Engineered to scale.
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
                CodeAscend is a full-stack engineering project built by
                Rahul Singh to combine competitive programming, backend
                engineering, system design, and modern web technologies into
                a single developer-focused platform.
              </p>

            </div>

            {/* Feature Highlights */}
            <div className="space-y-3">

              <h4 className="font-mono text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                Engineering Highlights
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {featureHighlights.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="p-3.5 rounded-2xl bg-[#171E31]/70 border border-[#2A364F] hover:border-arena-purple/60 hover:bg-[#1E2840] transition-all flex items-center gap-2.5 shadow-sm group"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />

                    <span className="font-mono text-xs text-slate-200 font-medium leading-snug">
                      {feature}
                    </span>
                  </motion.div>
                ))}

              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3 pt-2">

              <h4 className="font-mono text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                Technologies Used
              </h4>

              <div className="flex flex-wrap gap-2">

                {techStack.map((tech, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.06 }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-arena-purple text-xs font-mono text-slate-200 transition-all cursor-default select-none shadow-sm"
                  >
                    {tech}
                  </motion.span>
                ))}

              </div>
            </div>

            {/* Personal Quote */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171E31] to-[#1E293B] border border-[#2A364F] relative shadow-lg">

              <Quote className="h-8 w-8 text-arena-purple/30 absolute top-4 right-4 pointer-events-none" />

              <blockquote className="font-sans italic text-sm text-slate-200 leading-relaxed relative z-10">
                &ldquo;I believe the best way to learn software engineering
                is to build real systems, understand how they work under the
                hood, and continuously improve them.&rdquo;
              </blockquote>

              <div className="mt-3 font-mono text-xs font-bold text-arena-purple-soft">
                &mdash; Rahul Singh
              </div>

            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

