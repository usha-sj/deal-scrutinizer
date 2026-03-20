import { CheckCircle, AlertCircle, XCircle, TrendingDown, Globe, X } from "lucide-react";

export default function SidePanel({ claim, onClose }) {
  if (!claim) return null;

  const verdictConfig = {
    supported: {
      label: "Supported",
      Icon: CheckCircle,
      color: "var(--green-bright)",
      bg: "var(--green-dim)",
      border: "var(--green-border)",
    },
    unverified: {
      label: "Unverified",
      Icon: AlertCircle,
      color: "var(--yellow-bright)",
      bg: "var(--yellow-dim)",
      border: "var(--yellow-border)",
    },
    contradicted: {
      label: "Contradicted",
      Icon: XCircle,
      color: "var(--red-bright)",
      bg: "var(--red-dim)",
      border: "var(--red-border)",
    },
  };

  const typeConfig = {
    financial: { label: "Financial", dot: "#f85149" },
    market: { label: "Market", dot: "#d29922" },
    competitive: { label: "Competitive", dot: "#58a6ff" },
    team: { label: "Team / Traction", dot: "#e3b341" },
  };

  const verdict = verdictConfig[claim.verdict] || verdictConfig.unverified;
  const type = typeConfig[claim.type] || typeConfig.financial;
  const { Icon } = verdict;

  return (
    <div className="h-full flex flex-col"
      style={{ background: "var(--bg-surface)", borderLeft: "1px solid var(--border-default)" }}>

      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: type.dot }} />
          <span className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: "var(--text-muted)" }}>
            {type.label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-5 space-y-5">

          {/* Claim */}
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: "var(--text-muted)" }}>
              Claim
            </p>
            <div className="px-4 py-3 rounded-lg"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-sm leading-relaxed italic"
                style={{ color: "var(--text-primary)" }}>
                {`"${claim.quote}"`}
              </p>
            </div>
          </div>

          {/* Verdict */}
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: "var(--text-muted)" }}>
              Verdict
            </p>
            <div className="px-4 py-3 rounded-lg"
              style={{
                background: verdict.bg,
                border: `1px solid ${verdict.border}`,
              }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} style={{ color: verdict.color }} />
                <span className="text-sm font-semibold" style={{ color: verdict.color }}>
                  {verdict.label}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {claim.short_verdict}
              </p>
            </div>
          </div>

          {/* Analysis */}
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: "var(--text-muted)" }}>
              Analysis
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {claim.analysis}
            </p>
          </div>

          {/* Bear Case */}
          <div className="px-4 py-4 rounded-lg"
            style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={12} style={{ color: "var(--red-bright)" }} />
              <p className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: "var(--red-bright)" }}>
                Bear Case
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {claim.bear_case}
            </p>
          </div>

          {/* Live Market Data */}
          {claim.web_findings && claim.web_findings.trim().length > 0 && (
            <div className="px-4 py-4 rounded-lg"
              style={{ background: "var(--blue-dim)", border: "1px solid var(--blue-border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Globe size={12} style={{ color: "var(--blue-bright)" }} />
                <p className="text-xs font-semibold tracking-wider uppercase"
                  style={{ color: "var(--blue-bright)" }}>
                  Live Market Data
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {claim.web_findings}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          Click any highlighted phrase to analyze that claim
        </p>
      </div>
    </div>
  );
}