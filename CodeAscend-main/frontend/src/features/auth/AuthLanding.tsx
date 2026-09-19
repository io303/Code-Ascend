import { Link } from "react-router-dom";
import codearenaMark from "@/assets/branding/codearena-mark.png";

export function AuthLanding() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Hero Section */}
      <div className="rounded-3xl border border-arena-border bg-arena-surface p-8 sm:p-12 shadow-card text-center space-y-6">
        <div className="mx-auto flex justify-center">
          <img src={codearenaMark} alt="CodeAscend Logo" className="h-16 w-auto object-contain" />
        </div>
        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight">
            Code<span className="text-arena-purple">Ascend</span>
          </h1>
          <p className="text-base text-arena-muted leading-relaxed">
            The competitive programming and intelligent code evaluation platform. Code, compete, and ascend.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/auth/login"
            className="px-6 py-3 rounded-xl bg-arena-purple text-white font-bold text-sm hover:bg-arena-purple-hover transition-all shadow-purple"
          >
            Sign In to CodeAscend
          </Link>
          <Link
            to="/auth/register"
            className="px-6 py-3 rounded-xl border border-arena-border bg-arena-bg text-white font-bold text-sm hover:bg-arena-surface-hover transition-all"
          >
            Create New Account
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-arena-border bg-arena-surface shadow-card space-y-2">
          <div className="text-2xl">⚡</div>
          <h3 className="font-heading font-bold text-white text-base">Asynchronous Execution</h3>
          <p className="text-xs text-arena-muted leading-relaxed">
            Submissions are queued via Kafka and evaluated against comprehensive hidden test suites.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-arena-border bg-arena-surface shadow-card space-y-2">
          <div className="text-2xl">🤖</div>
          <h3 className="font-heading font-bold text-white text-base">OpenAI AI Agents</h3>
          <p className="text-xs text-arena-muted leading-relaxed">
            Instant feedback on time/space complexity, code quality analysis, plagiarism detection, and contextual hints.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-arena-border bg-arena-surface shadow-card space-y-2">
          <div className="text-2xl">🏆</div>
          <h3 className="font-heading font-bold text-white text-base">Redis Global Leaderboard</h3>
          <p className="text-xs text-arena-muted leading-relaxed">
            Real-time Elo rating updates cached in high-performance Redis sorted sets.
          </p>
        </div>
      </div>
    </div>
  );
}
