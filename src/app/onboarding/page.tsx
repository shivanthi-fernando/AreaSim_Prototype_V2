"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Step1Project } from "@/components/onboarding/Step1Project";
import { Step3Lease } from "@/components/onboarding/Step3Lease";
import { Step3FloorPlans } from "@/components/onboarding/Step3FloorPlans";
import { Step6Done } from "@/components/onboarding/Step6Done";
import { useOnboardingStore } from "@/store/onboarding";

// ─── Consultant Modal ─────────────────────────────────────────────────────────
const CONSULTANTS = [
  {
    name: "Håvard Røyne",
    title: "CEO & Partner",
    bio: "Extensive management and project leadership experience from Gjensidige NOR, OBOS Basale, Aberdeen Standard Investment, and Statsbygg.",
    phone: "+47 90 09 01 70",
    email: "havard@areasim.no",
    photo: "https://areasim.ai/images/team/haavard.jpg",
  },
  {
    name: "Mads Dyrseth",
    title: "COO & Partner",
    bio: "One of Norway's foremost analysts on government leases, with expertise in financial analysis, consulting, and commercial property from Statsbygg and SVV.",
    phone: "+47 97 40 78 49",
    email: "mads@areasim.no",
    photo: "https://areasim.ai/images/team/mads.jpg",
  },
];

function ConsultantModal({ onClose, onDashboard }: { onClose: () => void; onDashboard: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-xl bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        {/* Header — white, no gradient */}
        <div className="relative px-6 pt-6 pb-5 border-b border-border">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:bg-border transition-colors"
          >
            <X size={14} />
          </button>
          <h2 className="text-xl font-extrabold text-text" style={{ fontFamily: "var(--font-manrope)" }}>
            Contact our consultants
          </h2>
          <p className="text-sm text-text-muted font-body mt-1">
            Our experts will guide you on how to proceed without a floor plan.
          </p>
        </div>

        {/* Consultants */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {CONSULTANTS.map((c) => (
            <div
              key={c.email}
              className="flex gap-4 p-4 rounded-2xl border border-border bg-surface hover:border-primary/20 hover:shadow-card transition-all"
            >
              <div className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photo}
                  alt={c.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-surface-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>{c.name}</p>
                <p className="text-xs text-accent font-semibold font-body mb-1">{c.title}</p>
                <p className="text-xs text-text-muted font-body leading-relaxed mb-3">{c.bio}</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-primary/5 hover:text-primary text-xs font-medium text-text-muted transition-colors border border-border">
                    <Phone size={12} /> {c.phone}
                  </a>
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-light text-xs font-medium transition-colors">
                    <Mail size={12} /> {c.email}
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Dashboard redirect */}
          <div className="pt-2 border-t border-border space-y-3">
            <p className="text-xs text-text-muted font-body text-center">
              Already contacted our team? You can continue to your dashboard.
            </p>
            <button
              onClick={onDashboard}
              className="mx-auto flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors font-body"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const STEPS = [
  { label: "Create project", description: "Tell us about your project" },
  { label: "Add lease parameters",   description: "Add Lease parameters" },
  { label: "Add floor plans",  description: "Add floor plans" },
];

const stepMeta: Record<number, { title: string; subtitle: string; illuBg: string }> = {
  0: { title: "Create Your First Project",   subtitle: "Tell us about your building and location.",     illuBg: "from-blue-50 to-sky-100" },
  1: { title: "Add Lease Parameters",        subtitle: "Enter your area and cost details.",              illuBg: "from-amber-50 to-orange-100" },
  2: { title: "Add Floor Plans",             subtitle: "Upload and verify your floor plan layouts.",    illuBg: "from-indigo-50 to-blue-100" },
  3: { title: "Great you're all set!",       subtitle: "Your setup is complete.",                        illuBg: "from-green-50 to-teal-100" },
};

// ─── Step Illustrations ───────────────────────────────────────────────────────

function IlluStep1() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      <motion.rect x="85" y="70" width="130" height="140" rx="6" fill="white" stroke="#CBD5E1" strokeWidth="2"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ transformOrigin: "150px 210px" }} />
      {[{ x: 100, y: 90 }, { x: 135, y: 90 }, { x: 170, y: 90 },
        { x: 100, y: 125 }, { x: 135, y: 125 }, { x: 170, y: 125 },
        { x: 100, y: 160 }, { x: 135, y: 160 }, { x: 170, y: 160 }].map((w, i) => (
        <motion.rect key={i} x={w.x} y={w.y} width="22" height="20" rx="3"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.05 }} />
      ))}
      <motion.rect x="133" y="180" width="34" height="30" rx="3" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
      <motion.path d="M 75 72 L 150 28 L 225 72" stroke="#1A7FA8" strokeWidth="2.5" fill="none" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      <motion.rect x="60" y="12" width="180" height="24" rx="12" fill="#0A4F6E"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }} style={{ transformOrigin: "150px 24px" }} />
      <motion.text x="150" y="28" textAnchor="middle" fontSize="10" fill="white" fontWeight="700"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        Aker Brygge Tower
      </motion.text>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        <circle cx="150" cy="234" r="10" fill="#0F7663" />
        <text x="150" y="252" textAnchor="middle" fontSize="8.5" fill="#64748B">Oslo, Norway</text>
      </motion.g>
    </svg>
  );
}

function IlluStep3() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      <rect x="30" y="30" width="240" height="195" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.06))" }} />
      <rect x="30" y="30" width="240" height="32" rx="12" fill="#F8FAFC" />
      <rect x="30" y="50" width="240" height="12" fill="#F8FAFC" />
      <text x="46" y="50" fontSize="9" fill="#94A3B8" fontWeight="600">LEASE OVERVIEW</text>
      {[
        { label: "Annual Rent",  value: "NOK 2,500,000", color: "#DBEAFE", text: "#1D4ED8", y: 75 },
        { label: "Total Area",   value: "10,000 SqFt",   color: "#DCFCE7", text: "#15803D", y: 113 },
        { label: "Common Area",  value: "NOK 400,000",   color: "#FEF9C3", text: "#854D0E", y: 151 },
        { label: "Headcount",    value: "120 people",    color: "#F3E8FF", text: "#7E22CE", y: 189 },
      ].map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.12 }}>
          <rect x="44" y={m.y} width={212} height={28} rx="6" fill={m.color} />
          <text x="54" y={m.y + 18} fontSize="9" fill="#374151">{m.label}</text>
          <text x="248" y={m.y + 18} textAnchor="end" fontSize="9.5" fill={m.text} fontWeight="700">{m.value}</text>
        </motion.g>
      ))}
      <motion.rect x="44" y="225" width="0" height="6" rx="3" fill="url(#leaseGrad)"
        animate={{ width: 180 }} transition={{ delay: 0.8, duration: 1, ease: "easeOut" }} />
      <defs>
        <linearGradient id="leaseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A7FA8" /><stop offset="100%" stopColor="#0F7663" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IlluStep6() {
  return (
    <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-60">
      {[
        { x: 60,  y: 50,  color: "#60A5FA", size: 8 },
        { x: 100, y: 35,  color: "#34D399", size: 6 },
        { x: 180, y: 40,  color: "#F59E0B", size: 7 },
        { x: 230, y: 60,  color: "#A78BFA", size: 9 },
        { x: 240, y: 120, color: "#F472B6", size: 6 },
        { x: 55,  y: 140, color: "#34D399", size: 8 },
        { x: 80,  y: 200, color: "#60A5FA", size: 5 },
        { x: 210, y: 200, color: "#F59E0B", size: 7 },
        { x: 250, y: 170, color: "#A78BFA", size: 6 },
      ].map((p, i) => (
        <motion.rect key={i} x={p.x} y={p.y} width={p.size} height={p.size} rx={p.size / 3} fill={p.color}
          animate={{ y: [p.y, p.y + 12, p.y], rotate: [0, 180, 360], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }} />
      ))}
      <motion.circle cx="150" cy="120" r="60" fill="white" stroke="#D1FAE5" strokeWidth="2.5"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,201,167,0.2))" }}
        animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x="150" y="145" textAnchor="middle" fontSize="11" fill="#0D1B2A" fontWeight="800">Setup Complete!</text>
      {["Map Rooms", "Count Occupants", "Analyse & Report"].map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.18 }}>
          <rect x="76" y={198 + i * 18} width="148" height="14" rx="7"
            fill={["#DBEAFE", "#D1FAE5", "#FEF9C3"][i]} />
          <text x="150" y={208 + i * 18} textAnchor="middle" fontSize="8" fontWeight="600"
            fill={["#1D4ED8", "#15803D", "#854D0E"][i]}>
            {i + 1}. {s}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

const ILLUSTRATIONS = [
  <IlluStep1 key={0} />,
  <IlluStep3 key={1} />, // Lease illustration for Step 2
  null,                  // No illustration for Step 3
  <IlluStep6 key={3} />, // Done illustration for Step 4
];

const slideVariants = {
  enterRight: { opacity: 0, x: 32 },
  center:     { opacity: 1, x: 0 },
  exitLeft:   { opacity: 0, x: -32 },
  enterLeft:  { opacity: 0, x: -32 },
  exitRight:  { opacity: 0, x: 32 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { currentStep, nextStep, prevStep, setStep } = useOnboardingStore();
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const isLastStep = currentStep === 3;
  const isStep3 = currentStep === 2; // Add Floor Plans step
  const meta = stepMeta[currentStep];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-border bg-surface">
        <Logo size="sm" />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl space-y-7">
          {/* Step indicator */}
          {!isLastStep && <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setStep} />}

          {/* Split card */}
          <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
            <div className={`grid grid-cols-1 ${isLastStep || isStep3 ? "" : "lg:grid-cols-2"}`}>

              {/* ── Left: form ────────────────────────────────────────── */}
              <div className={`flex flex-col ${isLastStep || isStep3 ? "" : "border-b lg:border-b-0 lg:border-r border-border"}`}>
                {/* Step header */}
                {!isLastStep && (
                  <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-border">
                    <p className="text-xs font-semibold text-text-muted font-mono uppercase tracking-widest mb-1">
                      Step {currentStep + 1} of {STEPS.length}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <h1 className="text-xl sm:text-2xl font-700 text-text"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 700 }}>
                        {meta.title}
                      </h1>
                      {isStep3 && (
                        <button
                          type="button"
                          onClick={() => setShowConsultantModal(true)}
                          className="shrink-0 text-sm font-medium text-text-muted hover:text-primary underline underline-offset-2 transition-colors font-body"
                        >
                          Don&apos;t have a floor plan?
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-text-muted font-body mt-1">{meta.subtitle}</p>
                  </div>
                )}

                {/* Form content */}
                <div className="px-6 sm:px-8 py-7 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      variants={slideVariants}
                      initial="enterRight"
                      animate="center"
                      exit="exitLeft"
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {currentStep === 0 && <Step1Project onNext={nextStep} />}
                      {currentStep === 1 && <Step3Lease onNext={nextStep} onBack={prevStep} />}
                      {currentStep === 2 && <Step3FloorPlans onNext={nextStep} onBack={prevStep} />}
                      {currentStep === 3 && <Step6Done />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Right: illustration (hidden on last step and step 3) ────────── */}
              <div className={`${isLastStep || isStep3 ? "hidden" : "hidden lg:flex"} items-center justify-center bg-gradient-to-br ${meta.illuBg} px-8 py-10 min-h-[420px]`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full max-w-xs"
                  >
                    {ILLUSTRATIONS[currentStep]}

                    {/* Step label pill */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-5 text-center"
                    >
                      <span className="inline-block rounded-full bg-white/70 border border-white/60 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-text/70 font-body">
                        {meta.subtitle}
                      </span>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Progress dots (mobile only) */}
          <div className="lg:hidden flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <div key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-6 bg-primary" : i < currentStep ? "w-2 bg-accent" : "w-2 bg-border"
                }`} />
            ))}
          </div>
        </div>
      </main>

      {/* Consultant Modal */}
      <AnimatePresence>
        {showConsultantModal && (
          <ConsultantModal
            onClose={() => setShowConsultantModal(false)}
            onDashboard={() => router.push("/dashboard")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
