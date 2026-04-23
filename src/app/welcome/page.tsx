"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

// ─── Simple looping illustration ──────────────────────────────────────────────

function HeroIllustration() {
  const repeatDelay = 2;

  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

      {/* Floor plan outline */}
      <motion.rect x="30" y="20" width="170" height="145" rx="5"
        fill="rgba(10,79,110,0.07)" stroke="#0A4F6E" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity, repeatDelay }} />

      {/* Room dividers */}
      {[
        { d: "M 30 95 L 200 95" },
        { d: "M 115 20 L 115 95" },
        { d: "M 115 95 L 115 165" },
      ].map((p, i) => (
        <motion.path key={i} d={p.d} stroke="#1A7FA8" strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85 + i * 0.18, ease: "easeOut", repeat: Infinity, repeatDelay }} />
      ))}

      {/* Room labels */}
      {[
        { x: 72, y: 62, label: "Meeting" },
        { x: 157, y: 62, label: "Office" },
        { x: 72, y: 134, label: "Break" },
        { x: 157, y: 134, label: "Focus" },
      ].map((l, i) => (
        <motion.text key={i} x={l.x} y={l.y} textAnchor="middle" fontSize="9.5"
          fill="#1A7FA8" fontWeight="600"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.45 + i * 0.14, duration: 0.3, repeat: Infinity, repeatDelay }} >
          {l.label}
        </motion.text>
      ))}

      {/* People dots in rooms */}
      {[
        { cx: 62, cy: 74 }, { cx: 78, cy: 74 },
        { cx: 148, cy: 74 }, { cx: 164, cy: 74 }, { cx: 156, cy: 83 },
        { cx: 72, cy: 148 },
      ].map((dot, i) => (
        <motion.circle key={i} cx={dot.cx} cy={dot.cy} r="4.5"
          fill="#00C9A7" stroke="white" strokeWidth="1.2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.85 + i * 0.1, duration: 0.22, type: "spring", repeat: Infinity, repeatDelay }} />
      ))}

      {/* Insights card sliding in from right */}
      <motion.rect x="212" y="28" width="82" height="130" rx="8"
        fill="white" stroke="#D0DDE6" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 4px 14px rgba(10,79,110,0.13))" }}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5, duration: 0.4, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay }} />

      <motion.text x="253" y="46" textAnchor="middle" fontSize="8" fill="#5C7A8A" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.8, repeat: Infinity, repeatDelay }}>
        INSIGHTS
      </motion.text>

      {/* Bar chart rows */}
      {[
        { y: 60, label: "Cost", pct: 72, color: "#0A4F6E" },
        { y: 83, label: "Space", pct: 55, color: "#1A7FA8" },
        { y: 106, label: "Usage", pct: 88, color: "#00C9A7" },
      ].map((b, i) => (
        <motion.g key={i}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.9 + i * 0.15, repeat: Infinity, repeatDelay }}>
          <text x="218" y={b.y - 2} fontSize="7.5" fill="#5C7A8A">{b.label}</text>
          {/* Track */}
          <rect x="218" y={b.y + 2} width="68" height="5" rx="2.5" fill="#EEF3F8" />
          {/* Fill bar */}
          <motion.rect x="218" y={b.y + 2} height="5" rx="2.5" fill={b.color}
            initial={{ width: 0 }}
            animate={{ width: (68 * b.pct) / 100 }}
            transition={{ delay: 3.0 + i * 0.15, duration: 0.55, ease: "easeOut", repeat: Infinity, repeatDelay }} />
        </motion.g>
      ))}

      {/* Green tick + "Ready" */}
      <motion.rect x="218" y="126" width="68" height="18" rx="5" fill="rgba(0,201,167,0.12)" stroke="#00C9A7" strokeWidth="1"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.55, duration: 0.3, type: "spring", repeat: Infinity, repeatDelay }}
        style={{ transformOrigin: "252px 135px" }} />
      <motion.text x="252" y="139" textAnchor="middle" fontSize="8" fill="#0F7663" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3.7, repeat: Infinity, repeatDelay }}>
        ✓ Report ready
      </motion.text>

    </svg>
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

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center text-center max-w-lg w-full gap-8"
        >
          {/* Title + description */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="text-3xl sm:text-4xl font-extrabold text-text leading-tight"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Your workspace,<br />clearly understood.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-base text-text-muted font-body leading-relaxed"
            >
              Map your floor plan, count occupancy, and get instant insights — your first workplace report in minutes.
            </motion.p>
          </div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="w-full rounded-2xl border border-border bg-gradient-to-br from-[#EEF3F8] to-[#E0ECF5] overflow-hidden"
            style={{ height: "220px" }}
          >
            <div className="w-full h-full flex items-center justify-center p-4">
              <HeroIllustration />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/onboarding")}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: "var(--color-primary)",
              fontFamily: "var(--font-manrope)",
              boxShadow: "0 4px 16px rgba(10,79,110,0.28)",
            }}
          >
            Continue
            <ArrowRight size={15} />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
