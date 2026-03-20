"use client";
import { CheckCircle, AlertTriangle, XCircle, ClipboardList, ArrowLeft} from "lucide-react";

export default function Header({ summary, companyName, onReset, onToggleQuickScan, quickScanActive }) {
  const verdictConfig = {
    proceed: {
      label: "Proceed to Diligence",
      Icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-800/40",
    },
    investigate_further: {
      label: "Investigate Further",
      Icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-800/40",
    },
    pass: {
      label: "Pass",
      Icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-950/40 border-red-800/40",
    },
  };

  const verdict = verdictConfig[summary.overall_recommendation] || verdictConfig.investigate_further;
  const { Icon } = verdict;

  return (
    <header style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-default)" }}
      className="px-6 py-3 flex flex-col gap-1.5 flex-shrink-0">

      {/* Row 1 */}
      <div className="flex items-center gap-3">

        {/* Logo mark */}
        <div className="flex items-center gap-2 mr-2">
            <img 
                src="/sagard.png" 
                alt="Sagard" 
                style={{ height: "28px" }}></img>        
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ background: "var(--border-default)" }} />

        {/* Company name */}
        <h1 className="font-semibold text-sm truncate max-w-[220px]"
          style={{ color: "var(--text-primary)" }}>
          {companyName || "Deal Analysis"}
        </h1>

        {/* Verdict badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border flex-shrink-0 ${verdict.bg} ${verdict.color}`}>
          <Icon size={11} />
          {verdict.label}
        </span>

        <div className="flex-1" />

        {/* Claim stats */}
        <div className="flex items-center gap-6 mr-3">
          {[
            { val: summary.total_claims, label: "Claims", color: "var(--text-primary)" },
            { val: summary.contradicted, label: "Contradicted", color: "var(--red-bright)" },
            { val: summary.unverified, label: "Unverified", color: "var(--yellow-bright)" },
            { val: summary.supported, label: "Supported", color: "var(--green-bright)" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-bold text-base leading-none" style={{ color: s.color }}>{s.val}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: "var(--border-default)" }} />

        {/* Buttons */}
        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={onToggleQuickScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border"
            style={quickScanActive ? {
              background: "var(--accent-gold-dim)",
              borderColor: "var(--accent-gold-border)",
              color: "var(--accent-gold)",
            } : {
              background: "var(--bg-elevated)",
              borderColor: "var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            <ClipboardList size={12} />
            Quick Scan
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "var(--border-default)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
          >
            <ArrowLeft size={12} />
            New Deal
          </button>
        </div>
      </div>

      {/* Row 2: headline */}
      <p className="text-xs leading-relaxed pl-10" style={{ color: "var(--text-secondary)" }}>
        {summary.headline_finding}
      </p>
    </header>
  );
}