import React from "react";
import { CheckCircle2, Clock, Cpu, ShieldAlert, Sparkles } from "lucide-react";
import type { SubmissionStatus } from "@/types";

type JudgePipelineProps = {
  status: SubmissionStatus;
  pollCount?: number;
};

export function JudgePipelineVisualizer({ status, pollCount = 0 }: JudgePipelineProps) {
  const isPending = status === "PENDING";
  const isRunning = status === "RUNNING";
  const isAccepted = status === "ACCEPTED";
  const isTerminalFailure = status !== "PENDING" && status !== "RUNNING" && status !== "ACCEPTED";

  const steps = [
    {
      id: "queued",
      label: "Queued",
      desc: "Kafka Event Broker",
      completed: !isPending,
      active: isPending,
    },
    {
      id: "compiling",
      label: "Sandbox Compile",
      desc: "Isolating Process",
      completed: isRunning || isAccepted || isTerminalFailure,
      active: isRunning && pollCount % 2 === 0,
    },
    {
      id: "executing",
      label: "Running Tests",
      desc: "Checking Standard Stdin",
      completed: isAccepted || isTerminalFailure,
      active: isRunning && pollCount % 2 === 1,
    },
    {
      id: "final",
      label: isAccepted ? "Accepted" : isTerminalFailure ? status.replace("_", " ") : "Evaluation",
      desc: isAccepted ? "All Cases Passed" : isTerminalFailure ? "Execution Failed" : "Awaiting Terminal Status",
      completed: isAccepted || isTerminalFailure,
      active: false,
      isError: isTerminalFailure,
    },
  ];

  return (
    <div className="rounded-2xl border border-arena-border bg-arena-surface p-4 shadow-card space-y-3">
      <div className="flex items-center justify-between border-b border-arena-border pb-2 text-xs">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-arena-orange" />
          <span>Real-time Judge Pipeline</span>
        </span>
        <span className="font-mono text-arena-muted">
          {isRunning ? `Evaluating (${pollCount}/30)...` : isAccepted ? "Success" : isPending ? "Enqueued" : "Completed"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`p-2.5 rounded-xl border text-xs transition-all ${
              step.completed
                ? step.isError
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : step.active
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400 animate-pulse"
                : "border-arena-border bg-arena-bg/40 text-arena-muted"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span>0{idx + 1}</span>
              {step.completed ? (
                step.isError ? (
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                )
              ) : step.active ? (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              ) : (
                <Clock className="h-3 w-3 text-arena-muted" />
              )}
            </div>
            <p className="font-bold text-white mt-1 leading-tight">{step.label}</p>
            <p className="text-[10px] text-arena-muted">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
