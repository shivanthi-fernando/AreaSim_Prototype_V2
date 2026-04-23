"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

// ─── Looping "before → after" animation ───────────────────────────────────────

type Phase = "before" | "scan" | "after";

function HeroAnimation() {
  const [phase, setPhase] = useState<Phase>("before");

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;

    const cycle = () => {
      setPhase("before");
      t1 = setTimeout(() => setPhase("scan"), 3000);
      t2 = setTimeout(() => setPhase("after"), 3800);
      t3 = setTimeout(cycle, 8200);
    };

    cycle();
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const progress = phase === "before" ? 0 : phase === "scan" ? 40 : 100;

  return (
    <div className="relative w-full bg-surface rounded-2xl border border-border shadow-card overflow-hidden select-none">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-surface-2">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">
          Workplace Assessment
        </span>
        <AnimatePresence mode="wait">
          {phase === "before" && (
            <motion.span key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-semibold text-red-400 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              Manual tracking
            </motion.span>
          )}
          {phase === "after" && (
            <motion.span key="a" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
              ✓ Assessment ready
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Metric cards */}
      <div className="px-5 pt-4 pb-3 grid grid-cols-3 gap-2.5">
        {[
          { label: "Cost / employee", before: "???", after: "NOK 42k", delta: "+31%" },
          { label: "Sqm / employee",  before: "???", after: "28.5 m²", delta: "+58%" },
          { label: "Utilization",     before: "???", after: "68%",     delta: "−18pts" },
        ].map((m, i) => (
          <div key={i} className="p-2.5 rounded-xl border bg-surface-2 overflow-hidden relative">
            <p className="text-[9px] text-text-muted mb-1 font-body">{m.label}</p>
            <AnimatePresence mode="wait">
              {phase !== "after" ? (
                <motion.div key="before" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-border">—</span>
                  <span className="text-[9px] text-red-300 font-body">No data</span>
                </motion.div>
              ) : (
                <motion.div key="after" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-text">{m.after}</span>
                  <span className="text-[9px] font-semibold text-red-500">{m.delta} vs market</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Benchmark bars */}
      <div className="px-5 pb-3 space-y-2">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-text-muted font-mono">
          Cost benchmark (NOK/sqm)
        </p>
        {[
          { label: "Your cost",   pct: 78, color: "bg-primary", val: "2,850" },
          { label: "Benchmark",   pct: 50, color: "bg-accent",  val: "2,200" },
        ].map((b, i) => (
          <div key={i} className="space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[9px] text-text-muted font-body">{b.label}</span>
              <span className="text-[9px] font-bold font-mono text-text">{b.val}</span>
            </div>
            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${b.color} rounded-full`}
                animate={{ width: phase === "after" ? `${b.pct}%` : "0%" }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Opportunities row */}
      <div className="px-5 pb-4">
        <AnimatePresence>
          {phase === "after" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/8 border border-accent/20"
            >
              <span className="text-accent text-sm">↗</span>
              <span className="text-xs font-semibold text-text font-body">
                3 optimization opportunities identified
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan overlay */}
      <AnimatePresence>
        {phase === "scan" && (
          <motion.div
            key="scan"
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-accent shadow-lg"
              style={{ boxShadow: "0 0 12px 3px rgba(0,201,167,0.6)" }}
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 0.8, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-accent/[0.03]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="h-1 bg-surface-2 w-full">
        <motion.div
          className="h-full bg-accent rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: phase === "scan" ? 0.8 : 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      <header className="shrink-0 px-8 py-4 border-b border-border bg-surface flex items-center">
        <Logo size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10 lg:py-14">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: text + CTA ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-7"
          >
            <motion.span
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-xs font-semibold text-primary font-body"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              Workplace Assessment Tool
            </motion.span>

            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.5 }}
                className="text-3xl sm:text-4xl font-extrabold text-text leading-tight"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Your workspace,<br />clearly understood.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.45 }}
                className="text-base text-text-muted font-body leading-relaxed max-w-sm"
              >
                Enter your lease details and floor plans. Get instant insights on costs, space efficiency, and opportunities — your first business case in minutes.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => router.push("/onboarding")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white hover:shadow-lg active:scale-95 transition-all"
                style={{
                  background: "var(--color-primary)",
                  fontFamily: "var(--font-manrope)",
                  boxShadow: "0 4px 16px rgba(10,79,110,0.28)",
                }}
              >
                Start assessment
                <ArrowRight size={15} />
              </button>
              <p className="text-xs text-text-muted font-body">Under 3 minutes</p>
            </motion.div>
          </motion.div>

          {/* ── Right: looping animation ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <HeroAnimation />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
