"use client";
import { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";

const steps = [
  { label: "Rendering PDF pages", detail: "Extracting text and images from all sections" },
  { label: "Reading visual data", detail: "Analyzing charts, tables, and financial figures" },
  { label: "Identifying claims", detail: "Scanning for financial, market, and competitive assertions" },
  { label: "Running market checks", detail: "Cross-referencing claims against live data sources" },
  { label: "Verifying competitors", detail: "Checking named competitors and market positions" },
  { label: "Stress-testing financials", detail: "Validating EBITDA, growth rates, and unit economics" },
  { label: "Generating bear cases", detail: "Building adversarial scenarios for key claims" },
  { label: "Finalizing analysis", detail: "Compiling PE first-pass assessment" },
];

export default function Loading() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((i) => Math.min(i + 1, steps.length - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: "var(--bg-base)" }}>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-16">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent-gold-dim)", border: "1px solid var(--accent-gold-border)" }}>
          <BarChart2 size={13} style={{ color: "var(--accent-gold)" }} />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "var(--accent-gold)", letterSpacing: "0.15em" }}>
          Sagard
        </span>
      </div>

      {/* Spinner */}
      <div className="relative mb-10">
        <div className="w-14 h-14 rounded-full animate-spin"
          style={{
            border: "2px solid var(--border-default)",
            borderTopColor: "var(--accent-gold)",
          }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-gold)" }} />
        </div>
      </div>

      {/* Current step */}
      <p className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
        {steps[step].label}
      </p>
      <p className="text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
        {steps[step].detail}
      </p>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-12">
        {steps.map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-500"
            style={{
              width: i === step ? "20px" : "6px",
              height: "6px",
              background: i <= step ? "var(--accent-gold)" : "var(--border-default)",
            }} />
        ))}
      </div>

      {/* Note */}
      <div className="px-6 py-3 rounded-xl max-w-sm text-center"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Running parallel web searches and financial analysis.
          This typically takes 45–75 seconds.
        </p>
      </div>
    </div>
  );
}