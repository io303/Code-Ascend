import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Editor from "@monaco-editor/react";
import { fetchProblemBySlug, fetchEstimatedElo } from "@/lib/api/problems";
import { createSubmission, fetchSubmissionById, fetchSubmissionsByProblem, requestHint, runCode, RunCodeResult } from "@/lib/api/submissions";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JudgePipelineVisualizer } from "@/components/ui/JudgePipelineVisualizer";
import { AiPostSolveCoach } from "@/components/ui/AiPostSolveCoach";
import { ErrorCard, Skeleton } from "@/components/ui/FeedbackComponents";
import { toast } from "@/components/ui/Toast";
import type { SubmissionDetail, SubmissionLanguage } from "@/types";
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  Sparkles,
  Code2,
  BarChart3,
  FileText,
  Bot,
  Terminal,
  Trophy,
  CheckCircle2
} from "lucide-react";

const STARTER_CODE: Record<SubmissionLanguage, string> = {
  JAVA: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (!scanner.hasNext()) return;
        // Read input and solve
    }
}`,
  PYTHON: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    # Read input and solve

if __name__ == "__main__":
    solve()`,
  CPP: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Read input and solve
    return 0;
}`,
  JAVASCRIPT: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === '') return;
    // Read input and solve
}

solve();`,
};

export function ProblemWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"description" | "submissions" | "hints">("description");
  const [language, setLanguage] = useState<SubmissionLanguage>("PYTHON");
  const [code, setCode] = useState<string>(STARTER_CODE.PYTHON);
  const [fontSize, setFontSize] = useState<number>(13);
  const [customInput, setCustomInput] = useState<string>("");
  const [customRunResult, setCustomRunResult] = useState<RunCodeResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"run" | "submit">("run");

  const [currentSubmission, setCurrentSubmission] = useState<SubmissionDetail | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);
  const [aiHintText, setAiHintText] = useState<string | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: problem, isLoading: isProblemLoading, isError: isProblemError } = useQuery({
    queryKey: ["problem", slug],
    queryFn: () => fetchProblemBySlug(slug!),
    enabled: !!slug,
  });

  const { data: estimatedEloData } = useQuery({
    queryKey: ["estimated-elo", slug],
    queryFn: () => fetchEstimatedElo(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (problem && !customInput) {
      setCustomInput(problem.sampleInput || "");
    }
  }, [problem, customInput]);

  const { data: problemSubmissions, refetch: refetchSubmissions } = useQuery({
    queryKey: ["problem-submissions", slug],
    queryFn: () => fetchSubmissionsByProblem(slug!),
    enabled: !!slug,
  });

  const handleLanguageChange = (newLang: SubmissionLanguage) => {
    setLanguage(newLang);
    setCode(STARTER_CODE[newLang]);
  };

  const handleResetCode = () => {
    if (window.confirm("Reset code to starter template?")) {
      setCode(STARTER_CODE[language]);
    }
  };

  const runMutation = useMutation({
    mutationFn: runCode,
    onSuccess: (res) => {
      setCustomRunResult(res);
      setActiveResultTab("run");
      if (res.status === "ACCEPTED") {
        toast.success("Accepted! Output matches expected output.");
      } else if (res.status === "WRONG_ANSWER") {
        toast.error("Wrong Answer: Output differs from expected output.");
      } else if (res.status === "COMPILATION_ERROR") {
        toast.error("Compilation Error: Syntax or build issue.");
      } else if (res.status === "TIME_LIMIT_EXCEEDED") {
        toast.error("Time Limit Exceeded.");
      } else if (res.status === "MEMORY_LIMIT_EXCEEDED") {
        toast.error("Memory Limit Exceeded.");
      } else {
        toast.error(`Runtime Error: ${res.failureMessage || "Execution failed."}`);
      }
    },
    onError: () => {
      toast.error("Execution request failed.");
    }
  });

  const submitMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: (sub) => {
      setCurrentSubmission(sub);
      setActiveResultTab("submit");
      setIsPolling(true);
      setPollCount(0);
      refetchSubmissions();
      toast.info("Submission sent to judge queue...");
    },
    onError: () => {
      toast.error("Submission failed. Judge service offline.");
    }
  });

  const hintMutation = useMutation({
    mutationFn: requestHint,
    onSuccess: (data) => {
      setAiHintText(data.hint);
      toast.success("AI diagnostic hint generated.");
    },
  });

  const handleRunCode = () => {
    if (!problem || runMutation.isPending) return;
    runMutation.mutate({
      language,
      sourceCode: code,
      customInput,
      problemSlug: problem.slug,
    });
  };

  const handleSubmit = useCallback(() => {
    if (!problem || submitMutation.isPending || isPolling) return;
    submitMutation.mutate({
      problemId: problem.id,
      problemSlug: problem.slug,
      language,
      sourceCode: code,
    });
  }, [problem, submitMutation, isPolling, language, code]);

  // Polling logic for submission evaluation
  useEffect(() => {
    if (!isPolling || !currentSubmission) return;

    if (pollCount >= 30) {
      setIsPolling(false);
      return;
    }

    pollTimerRef.current = setTimeout(async () => {
      try {
        const updated = await fetchSubmissionById(currentSubmission.id);
        setCurrentSubmission(updated);
        setPollCount((prev) => prev + 1);

        if (updated.status !== "PENDING" && updated.status !== "RUNNING") {
          setIsPolling(false);
          refetchSubmissions();
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
          queryClient.invalidateQueries({ queryKey: ["estimated-elo", slug] });

          if (updated.status === "ACCEPTED") {
            toast.success(`ACCEPTED! +${updated.ratingDelta || 18} Elo gained.`);
          } else {
            toast.error(`Verdict: ${updated.status}`);
          }
        }
      } catch (err) {
        console.error("Error polling submission status", err);
        setIsPolling(false);
      }
    }, 2000);

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [isPolling, currentSubmission, pollCount, refetchSubmissions, queryClient, slug]);

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  if (isProblemLoading) {
    return (
      <div className="h-screen flex flex-col p-6 space-y-4 bg-arena-bg">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="flex-1 grid grid-cols-2 gap-4">
          <Skeleton className="h-full w-full rounded-2xl" />
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isProblemError || !problem) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <ErrorCard message="Problem challenge not found." onRetry={() => navigate("/problems")} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-61px)] flex flex-col bg-arena-bg overflow-hidden font-sans">
      {/* Top Workspace Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-arena-border bg-white px-4 py-2.5 gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="flex items-center gap-1.5 text-xs font-mono text-arena-text-secondary hover:text-arena-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-arena-text-secondary" />
            <span className="hidden sm:inline">Problems</span>
          </Link>
          <span className="text-arena-border font-mono">/</span>
          <h1 className="font-heading font-extrabold text-sm sm:text-base text-arena-text tracking-tight">
            {problem.title}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>

        {/* Action Controls & Estimated Rating */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {estimatedEloData?.alreadySolved ? (
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-arena-border bg-arena-surface-subtle text-arena-text-secondary">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Already Solved • No Additional Elo</span>
            </span>
          ) : (
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 font-bold">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Potential Rating • AC: +{estimatedEloData?.estimatedDelta ?? 18} Elo</span>
            </span>
          )}

          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="hidden sm:block rounded-xl border border-arena-border bg-white px-2.5 py-1.5 text-xs font-semibold text-arena-text focus:outline-none"
          >
            <option value={12}>12px</option>
            <option value={13}>13px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
          </select>

          <button
            type="button"
            onClick={handleResetCode}
            className="p-1.5 rounded-xl border border-arena-border bg-white text-arena-text-secondary hover:text-arena-text transition-colors"
            title="Reset Starter Code"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as SubmissionLanguage)}
            className="rounded-xl border border-arena-border bg-white px-3 py-1.5 text-xs font-semibold text-arena-text focus:border-arena-purple focus:outline-none"
          >
            <option value="PYTHON">Python 3</option>
            <option value="JAVA">Java 21</option>
            <option value="CPP">C++ 20</option>
            <option value="JAVASCRIPT">Node.js JavaScript</option>
          </select>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={runMutation.isPending}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-arena-purple-light bg-arena-surface-purple text-arena-purple font-bold hover:bg-arena-purple hover:text-white transition-all disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{runMutation.isPending ? "Running..." : "Run Code"}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitMutation.isPending || isPolling}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-arena-purple text-white font-extrabold hover:bg-arena-purple-hover disabled:opacity-50 transition-all shadow-purple"
          >
            {submitMutation.isPending || isPolling ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Submit</span>
                <kbd className="text-[10px] text-white/80 font-mono ml-0.5">⌘↵</kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Viewport */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-arena-border overflow-hidden">
        {/* Left Panel */}
        <div className="lg:col-span-5 flex flex-col bg-white overflow-hidden">
          <div className="flex items-center border-b border-arena-border bg-arena-surface-subtle px-3 pt-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`flex items-center gap-1.5 px-4 py-2 font-bold border-b-2 transition-all ${
                activeTab === "description"
                  ? "border-arena-purple text-arena-purple bg-white"
                  : "border-transparent text-arena-text-secondary hover:text-arena-text"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Description</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("submissions")}
              className={`flex items-center gap-1.5 px-4 py-2 font-bold border-b-2 transition-all ${
                activeTab === "submissions"
                  ? "border-arena-purple text-arena-purple bg-white"
                  : "border-transparent text-arena-text-secondary hover:text-arena-text"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Submissions ({problemSubmissions?.length ?? 0})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hints")}
              className={`flex items-center gap-1.5 px-4 py-2 font-bold border-b-2 transition-all ${
                activeTab === "hints"
                  ? "border-purple-600 text-purple-600 bg-white"
                  : "border-transparent text-arena-text-secondary hover:text-arena-text"
              }`}
            >
              <Bot className="h-3.5 w-3.5 text-purple-600" />
              <span>AI Assistant</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-arena-text">
            {activeTab === "description" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs font-mono text-arena-text-secondary">
                    <span>Acceptance: <strong className="text-arena-text">{problem.acceptanceRate}%</strong></span>
                    <span>•</span>
                    <span>Time Limit: <strong className="text-arena-text">{problem.timeLimitMs}ms</strong></span>
                    <span>•</span>
                    <span>Memory: <strong className="text-arena-text">{problem.memoryLimitMb}MB</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-xs">
                    {problem.tags?.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-arena-surface-subtle border border-arena-border text-arena-text-secondary">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-heading font-bold text-arena-text">Problem Statement</h3>
                    <p className="whitespace-pre-line text-arena-text-secondary text-xs leading-relaxed mt-1">{problem.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-arena-text-secondary uppercase tracking-wider">Input Format</h4>
                    <p className="whitespace-pre-line text-arena-text-secondary text-xs mt-0.5">{problem.inputFormat}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-arena-text-secondary uppercase tracking-wider">Output Format</h4>
                    <p className="whitespace-pre-line text-arena-text-secondary text-xs mt-0.5">{problem.outputFormat}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-arena-text-secondary uppercase tracking-wider">Constraints</h4>
                    <div className="rounded-xl bg-arena-surface-purple p-3 border border-arena-purple-light font-mono text-xs text-arena-purple mt-1 font-semibold">
                      {problem.constraints}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-arena-text-secondary uppercase tracking-wider">Sample Test Case</h4>
                    <div className="grid grid-cols-1 gap-3 font-mono text-xs mt-1">
                      <div className="space-y-1">
                        <span className="text-arena-text-secondary text-[11px]">Sample Input</span>
                        <pre className="p-3 rounded-xl bg-arena-surface-subtle border border-arena-border text-arena-text overflow-x-auto">
                          {problem.sampleInput}
                        </pre>
                      </div>
                      <div className="space-y-1">
                        <span className="text-arena-text-secondary text-[11px]">Expected Output</span>
                        <pre className="p-3 rounded-xl bg-arena-surface-subtle border border-arena-border text-arena-text overflow-x-auto font-bold">
                          {problem.sampleOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "submissions" && (
              <div className="space-y-3 font-mono text-xs">
                <h3 className="font-heading font-bold text-arena-text text-sm">Your Submission History</h3>
                {!problemSubmissions || problemSubmissions.length === 0 ? (
                  <p className="text-arena-text-secondary p-6 text-center border border-arena-border rounded-2xl bg-arena-surface-subtle">
                    No submissions recorded yet for this challenge.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {problemSubmissions.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/submissions/${sub.id}`}
                        className="p-3.5 rounded-2xl border border-arena-border bg-arena-surface-subtle hover:bg-arena-surface-purple transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-1">
                          <StatusBadge status={sub.status} />
                          <p className="text-[11px] text-arena-text-secondary">{sub.language} • {new Date(sub.submittedAt).toLocaleTimeString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-arena-text font-bold">{sub.runtimeMs != null ? `${sub.runtimeMs}ms` : "-"}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-arena-text text-sm flex items-center gap-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <span>AI Problem Diagnostic Coach</span>
                  </h3>
                </div>

                <p className="text-arena-text-secondary leading-relaxed font-sans text-xs">
                  Request a progressive hint tailored to your current source code without revealing full solution code.
                </p>

                {currentSubmission && (
                  <button
                    type="button"
                    onClick={() => hintMutation.mutate(currentSubmission.id)}
                    disabled={hintMutation.isPending}
                    className="px-4 py-2 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{hintMutation.isPending ? "Generating AI Hint..." : "Request AI Hint"}</span>
                  </button>
                )}

                {aiHintText && (
                  <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50 text-purple-900 leading-relaxed font-sans text-xs">
                    {aiHintText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Monaco Editor & Interactive Execution Drawer (MUST REMAIN DARK CHARCOAL FOR IDE COMFORT) */}
        <div className="lg:col-span-7 flex flex-col bg-[#1E1E2E] overflow-hidden">
          {/* Editor Container */}
          <div className="flex-1 relative min-h-[300px]">
            <Editor
              height="100%"
              language={language.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                fontSize,
                minimap: { enabled: false },
                fontFamily: "JetBrains Mono, Fira Code, monospace",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Execution Output Drawer - Dark Charcoal IDE Console */}
          <div className="h-64 border-t border-[#313244] bg-[#181825] flex flex-col overflow-hidden text-[#CDD6F4]">
            <div className="flex items-center justify-between border-b border-[#313244] px-4 py-2 bg-[#1E1E2E] font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveResultTab("run")}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    activeResultTab === "run"
                      ? "bg-arena-purple/30 text-arena-purple-soft border border-arena-purple/50"
                      : "text-[#A6ADC8] hover:text-white"
                  }`}
                >
                  Custom Stdin Test
                </button>
                <button
                  type="button"
                  onClick={() => setActiveResultTab("submit")}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    activeResultTab === "submit"
                      ? "bg-arena-purple/30 text-arena-purple-soft border border-arena-purple/50"
                      : "text-[#A6ADC8] hover:text-white"
                  }`}
                >
                  Submission Judge Result
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3">
              {activeResultTab === "run" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[#A6ADC8] text-[11px]">Custom Input (stdin)</span>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-[#313244] bg-[#1E1E2E] p-2.5 text-xs text-emerald-400 font-mono focus:border-arena-purple focus:outline-none"
                      placeholder="Enter custom test input lines..."
                    />
                  </div>

                  {customRunResult && (
                    <div className="space-y-3 pt-2 border-t border-[#313244]">
                      <div className="flex items-center justify-between bg-[#1E1E2E] p-2.5 rounded-xl border border-[#313244]">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#A6ADC8] font-bold">Verdict:</span>
                          <StatusBadge status={customRunResult.status} />
                        </div>
                        <span className="text-[#A6ADC8] text-[11px] font-mono">
                          Runtime: <strong className="text-white">{customRunResult.runtimeMs ?? 0}ms</strong> &bull; Memory: <strong className="text-white">{customRunResult.memoryKb ?? 0}KB</strong>
                        </span>
                      </div>

                      {/* Program Output (stdout) */}
                      <div className="space-y-1">
                        <span className="text-[#A6ADC8] text-[11px] font-bold">Program Output (stdout)</span>
                        <pre className="p-3 rounded-xl bg-[#1E1E2E] border border-[#313244] text-[#CDD6F4] font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {customRunResult.stdout || "(no stdout emitted)"}
                        </pre>
                      </div>

                      {/* Expected Output if available */}
                      {customRunResult.expectedOutput && (
                        <div className="space-y-1">
                          <span className="text-[#A6ADC8] text-[11px] font-bold">Expected Output</span>
                          <pre className="p-3 rounded-xl bg-[#1E1E2E] border border-emerald-500/30 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                            {customRunResult.expectedOutput}
                          </pre>
                        </div>
                      )}

                      {/* Line-by-Line Mismatch Diff when Wrong Answer */}
                      {customRunResult.status === "WRONG_ANSWER" && customRunResult.expectedOutput && (
                        <div className="space-y-1">
                          <span className="text-rose-400 text-[11px] font-bold">Output Mismatch Highlight</span>
                          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 font-mono text-xs space-y-1">
                            <div className="text-[11px] font-bold text-rose-400 border-b border-rose-500/20 pb-1 mb-2">
                              Your stdout did not match expected output:
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-gray-400 pb-1">
                              <div>Your Output:</div>
                              <div>Expected Output:</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                              <div className="p-2 rounded bg-rose-900/40 text-rose-200 overflow-x-auto">
                                {customRunResult.stdout.trim() || "(empty)"}
                              </div>
                              <div className="p-2 rounded bg-emerald-900/40 text-emerald-200 overflow-x-auto">
                                {customRunResult.expectedOutput.trim() || "(empty)"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stderr / Error Message */}
                      {customRunResult.failureMessage && (
                        <div className="space-y-1">
                          <span className="text-rose-400 text-[11px] font-bold">Stderr / Error Details</span>
                          <pre className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                            {customRunResult.failureMessage}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeResultTab === "submit" && (
                <div className="space-y-4">
                  {currentSubmission ? (
                    <>
                      <JudgePipelineVisualizer status={currentSubmission.status} />

                      {/* Post Solve Experience Banner */}
                      {currentSubmission.status === "ACCEPTED" && (
                        <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 space-y-3 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" /> ACCEPTED ✓
                            </span>
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                              +{currentSubmission.ratingDelta || 18} Elo Gained • Ascending
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-xs text-[#CDD6F4]">
                            <span>Runtime: <strong>{currentSubmission.runtimeMs ?? 118}ms</strong></span>
                            <span>Test Suite: <strong>{currentSubmission.passedTestCasesCount ?? 4}/{currentSubmission.totalTestCasesCount ?? 4} Passed</strong></span>
                          </div>

                          <AiPostSolveCoach
                            status={currentSubmission.status}
                            aiComplexityJson={currentSubmission.aiComplexityJson}
                            aiFeedback={currentSubmission.aiFeedback}
                            aiPlagiarismScore={currentSubmission.aiPlagiarismScore}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-8 text-center text-[#A6ADC8]">
                      Click "Submit" to dispatch your solution to the Kafka execution pipeline.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
