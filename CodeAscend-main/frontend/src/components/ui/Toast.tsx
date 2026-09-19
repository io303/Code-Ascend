import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

type Listener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
let listeners: Listener[] = [];

export const toast = {
  success: (text: string) => showToast("success", text),
  error: (text: string) => showToast("error", text),
  info: (text: string) => showToast("info", text),
};

function showToast(type: "success" | "error" | "info", text: string) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastMessage = { id, type, text };
  toasts = [...toasts, newToast];
  notifyListeners();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

function notifyListeners() {
  listeners.forEach((l) => l(toasts));
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastMessage[]>(toasts);

  useEffect(() => {
    const listener = (updated: ToastMessage[]) => setCurrentToasts(updated);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full font-mono text-xs pointer-events-none">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-card backdrop-blur-md animate-fade-in ${
            t.type === "success"
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-glow-emerald"
              : t.type === "error"
              ? "border-rose-500/50 bg-rose-500/10 text-rose-300 shadow-glow-rose"
              : "border-arena-cyan/50 bg-arena-cyan/10 text-arena-cyan shadow-cyan-sm"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {t.type === "error" && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
            {t.type === "info" && <Info className="h-4 w-4 text-arena-cyan shrink-0" />}
            <span className="font-sans font-medium text-xs text-white">{t.text}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              toasts = toasts.filter((item) => item.id !== t.id);
              notifyListeners();
            }}
            className="text-arena-muted hover:text-white transition-colors p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
