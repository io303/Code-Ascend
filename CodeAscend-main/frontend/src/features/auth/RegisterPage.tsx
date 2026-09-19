import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { register } from "@/features/auth/api";
import { useAuthStore } from "@/stores/auth-store";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import codearenaMark from "@/assets/branding/codearena-mark.png";

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return typeof error.response?.data?.message === "string"
      ? error.response.data.message
      : "Unable to create your account right now.";
  }
  return "Unable to create your account right now.";
}

function resolveRedirectTarget(location: ReturnType<typeof useLocation>) {
  const searchParams = new URLSearchParams(location.search);
  const queryRedirect = searchParams.get("redirect");
  const stateRedirect = location.state?.from;

  if (typeof stateRedirect === "string" && stateRedirect.startsWith("/")) {
    return stateRedirect;
  }
  if (typeof queryRedirect === "string" && queryRedirect.startsWith("/")) {
    return queryRedirect;
  }
  return "/dashboard";
}

export function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    displayName: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      setSession({
        accessToken: response.accessToken,
        user: response.user,
      });
      navigate(resolveRedirectTarget(location), { replace: true });
    },
  });

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text selection:bg-arena-purple/20 flex flex-col justify-between p-6">
      {/* Top Header with Logo & Back to Home */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2.5 group" title="Go to Home">
          <img src={codearenaMark} alt="CodeAscend Logo" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
          <span className="font-heading font-extrabold text-xl text-arena-text tracking-tight">
            Code<span className="text-arena-purple">Ascend</span>
          </span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-arena-border bg-white text-xs font-mono font-semibold text-arena-text-secondary hover:text-arena-text hover:border-arena-purple transition-all shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <section className="mx-auto grid max-w-5xl w-full gap-6 md:grid-cols-12 my-auto py-6">
        {/* Left Form Card */}
        <div className="md:col-span-7 rounded-3xl border border-arena-border bg-white p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-bold text-arena-text">Start Your Ascent</h2>
            <p className="text-xs text-arena-text-secondary">Build your rating. Understand your skills. Climb through consistent problem solving.</p>
          </div>

          {registerMutation.isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-mono">
              {getApiErrorMessage(registerMutation.error)}
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              registerMutation.mutate(form);
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-arena-text">Username</span>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-arena-muted" />
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={50}
                    value={form.username}
                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    className="w-full rounded-xl border border-arena-border bg-white pl-10 pr-4 py-2.5 text-sm text-arena-text placeholder-arena-muted outline-none focus:border-arena-purple focus:ring-1 focus:ring-arena-purple transition-all"
                    placeholder="coder_username"
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-arena-text">Display Name</span>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.displayName}
                  onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
                  className="w-full rounded-xl border border-arena-border bg-white px-4 py-2.5 text-sm text-arena-text placeholder-arena-muted outline-none focus:border-arena-purple focus:ring-1 focus:ring-arena-purple transition-all"
                  placeholder="Competitive Coder"
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-arena-text">Email Address</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-arena-muted" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-arena-border bg-white pl-10 pr-4 py-2.5 text-sm text-arena-text placeholder-arena-muted outline-none focus:border-arena-purple focus:ring-1 focus:ring-arena-purple transition-all"
                  placeholder="you@codeascend.com"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-arena-text">Password</span>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-arena-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-xl border border-arena-border bg-white pl-10 pr-10 py-2.5 text-sm text-arena-text placeholder-arena-muted outline-none focus:border-arena-purple focus:ring-1 focus:ring-arena-purple transition-all"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-arena-muted hover:text-arena-text p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full rounded-xl bg-arena-purple py-3 text-sm font-bold text-white hover:bg-arena-purple-hover disabled:opacity-50 transition-all shadow-purple"
            >
              {registerMutation.isPending ? "Creating account..." : "Register & Start Coding"}
            </button>
          </form>
        </div>

        {/* Right Side Info */}
        <div className="md:col-span-5 rounded-3xl border border-arena-border bg-white p-8 shadow-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-arena-purple-light bg-arena-surface-purple px-3.5 py-1 text-xs font-mono font-semibold text-arena-purple">
              <Sparkles className="h-3.5 w-3.5 text-arena-purple" />
              <span>Instant Access</span>
            </div>
            <h3 className="text-2xl font-heading font-bold text-arena-text tracking-tight">
              Already registered?
            </h3>
            <p className="text-xs text-arena-text-secondary leading-relaxed">
              Sign in to access your dashboard, problem bookmarks, submission history, and rating progression.
            </p>
          </div>

          <Link
            to={`/auth/login${location.search}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-arena-border bg-arena-surface-subtle text-xs font-mono font-bold text-arena-text hover:bg-arena-purple-verylight transition-all"
          >
            <span>Sign In Instead</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Footer link */}
      <footer className="text-center text-xs font-mono text-arena-text-secondary py-2">
        <Link to="/" className="hover:text-arena-text transition-colors">CodeAscend Home</Link>
      </footer>
    </div>
  );
}
