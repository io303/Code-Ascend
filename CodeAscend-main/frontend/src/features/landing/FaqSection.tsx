import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the CodeAscend judging pipeline execute code safely?",
      a: "Every submission is dispatched to an asynchronous Apache Kafka topic. Isolated worker instances fetch the job, compile the source code in a sandboxed container (C++20, Python 3, Java 21, Node.js), evaluate hidden test cases against time and memory limits, and persist the verdict back to PostgreSQL.",
    },
    {
      q: "How is the Elo rating delta calculated?",
      a: "CodeAscend uses a deterministic rating engine inspired by competitive chess ($K=32$). When you solve a problem on your first accepted submission, your rating increases based on the problem's difficulty tier relative to your current rating. Re-solving previously solved problems yields +0 Elo to prevent farming.",
    },
    {
      q: "What is Code DNA and how is skill mastery analyzed?",
      a: "Code DNA is an automated skill analysis feature that categorizes your accepted solutions across problem topic tags (Arrays, Trees, Graphs, Dynamic Programming, Greedy, Strings). It calculates topic confidence levels and highlights tailored recommendations for your next problem.",
    },
    {
      q: "Are the test cases real or simulated?",
      a: "All test cases are real and executed against actual compiler binaries. Each problem includes sample public test cases and extensive hidden test suites designed to catch edge cases, memory leaks, and integer overflow.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white border-t border-arena-border relative font-sans text-left">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arena-purple-light bg-arena-surface-purple text-xs font-mono font-bold text-arena-purple select-none cursor-default">
            <HelpCircle className="h-3.5 w-3.5 text-arena-purple" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-arena-text tracking-tight">
            ENGINEERING & ARCHITECTURE FAQ.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-arena-border bg-white overflow-hidden shadow-card transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-arena-text text-base sm:text-lg hover:text-arena-purple transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-arena-purple transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-xs sm:text-sm text-arena-text-secondary leading-relaxed font-sans border-t border-arena-border/50 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
