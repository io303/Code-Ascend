import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import codearenaMark from "@/assets/branding/codearena-mark.png";
import {
  CheckCircle2,
  Mail,
  MessageSquare,
  ArrowUpRight,
  GitBranch,
  Globe,
} from "lucide-react";

export function LandingFooter() {
  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200 relative font-sans overflow-hidden py-20 px-6">
      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-left">
          {/* Column 1: Identity & Value Props */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={columnVariants}
            className="lg:col-span-4 space-y-5"
          >
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <motion.img
                src={codearenaMark}
                alt="CodeAscend Mark"
                className="h-9 w-auto object-contain transition-transform duration-300"
                whileHover={{ rotate: 5, scale: 1.05 }}
              />
              <span className="font-heading font-extrabold text-2xl tracking-tight text-gray-900">
                Code<span className="text-arena-purple">Ascend</span>
              </span>
            </Link>

            {/* Tagline & Copy */}
            <div className="space-y-1 font-mono text-xs text-gray-600">
              <p className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                Practice. Compete. Grow.
              </p>
              <p className="leading-relaxed font-sans text-xs text-gray-600">
                Master algorithms, improve your competitive rating, and prepare for software engineering interviews.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-500 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>100+ Problems</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Live Judge</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Elo Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>AI Code Coach</span>
              </div>
            </div>

            {/* Platform Status Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-mono font-bold text-emerald-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Platform Online</span>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Platform Links */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={columnVariants}
            className="lg:col-span-2 space-y-4 font-mono text-xs"
          >
            <h4 className="font-heading font-extrabold text-gray-900 text-sm uppercase tracking-wider font-sans">
              Platform
            </h4>
            <ul className="space-y-2.5 text-gray-700">
              <li>
                <Link to="/problems" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Problems
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block text-arena-purple font-bold cursor-pointer">
                  Daily Challenge
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Resources Links */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={columnVariants}
            className="lg:col-span-3 space-y-4 font-mono text-xs"
          >
            <h4 className="font-heading font-extrabold text-gray-900 text-sm uppercase tracking-wider font-sans">
              Resources
            </h4>
            <ul className="space-y-2.5 text-gray-700">
              <li>
                <Link to="/how-it-works" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#elo" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Elo Rating System
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#ai" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  AI Code Coach
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#architecture" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/how-it-works#roadmap" className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Architecture Roadmap
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/sunav1411"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-arena-purple hover:underline hover:translate-x-1 transition-all inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="h-3 w-3 text-arena-purple" />
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Connect & Social Glass Buttons */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={columnVariants}
            className="lg:col-span-3 space-y-4 font-mono text-xs"
          >
            <h4 className="font-heading font-extrabold text-gray-900 text-sm uppercase tracking-wider font-sans">
              Connect
            </h4>
            <p className="text-gray-600 leading-relaxed font-sans text-xs">
              Join the CodeAscend developer community and follow update releases.
            </p>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <motion.a
                href="https://github.com/sunav1411"
                target="_blank"
                rel="noreferrer"
                tabIndex={0}
                whileHover={{ y: -2, scale: 1.03, rotate: 3 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-arena-purple hover:shadow-md transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-arena-purple shadow-sm"
              >
                <div className="p-1.5 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-arena-purple group-hover:text-white transition-colors">
                  <GitBranch className="h-4 w-4" />
                </div>
                <span className="font-bold text-gray-900 font-sans text-xs">GitHub Profile</span>
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/sunav-sunil-mattoo/"
                target="_blank"
                rel="noreferrer"
                tabIndex={0}
                whileHover={{ y: -2, scale: 1.03, rotate: 3 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-arena-purple hover:shadow-md transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-arena-purple shadow-sm"
              >
                <div className="p-1.5 rounded-xl bg-gray-100 text-blue-600 group-hover:bg-arena-purple group-hover:text-white transition-colors">
                  <Globe className="h-4 w-4" />
                </div>
                <span className="font-bold text-gray-900 font-sans text-xs">LinkedIn Profile</span>
              </motion.a>

              <motion.a
                href="mailto:9esunavmattoo@gmail.com"
                tabIndex={0}
                whileHover={{ y: -2, scale: 1.03, rotate: 3 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 hover:border-arena-purple hover:shadow-md transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-arena-purple shadow-sm"
              >
                <div className="p-1.5 rounded-xl bg-gray-100 text-amber-600 group-hover:bg-arena-purple group-hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-bold text-gray-900 font-sans text-xs">Email Me</span>
              </motion.a>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-200 opacity-60 cursor-not-allowed select-none">
                <div className="p-1.5 rounded-xl bg-gray-200 text-indigo-500">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between w-full font-sans text-xs">
                  <span className="font-bold text-gray-500">Discord</span>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-200">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Copyright & Tech Stack Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-gray-500">
          <div>
            <span>© 2026 CodeAscend. All rights reserved.</span>
          </div>

          <div className="text-center">
            <span>Built with <strong>React</strong> • <strong>Spring Boot</strong> • <strong>Kafka</strong> • <strong>PostgreSQL</strong></span>
          </div>

          <div>
            <span>Made in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
