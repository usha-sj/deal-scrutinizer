export default function SidePanel({ claim, onClose }) {
  if (!claim) return null;

  const verdictConfig = {
    supported: {
      badge: "Supported",
      icon: "✅",
      color: "text-green-300",
      bg: "bg-green-950/40 border-green-800/50",
    },
    unverified: {
      badge: "Unverified",
      icon: "⚠️",
      color: "text-yellow-300",
      bg: "bg-yellow-950/40 border-yellow-800/50",
    },
    contradicted: {
      badge: "Contradicted",
      icon: "🚨",
      color: "text-red-300",
      bg: "bg-red-950/40 border-red-800/50",
    },
  };

  const typeConfig = {
    financial: { label: "Financial", dot: "bg-red-500" },
    market: { label: "Market", dot: "bg-yellow-500" },
    competitive: { label: "Competitive", dot: "bg-blue-500" },
    team: { label: "Team / Traction", dot: "bg-orange-500" },
  };

  const verdict = verdictConfig[claim.verdict] || verdictConfig.unverified;
  const type = typeConfig[claim.type] || typeConfig.financial;

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800/60">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${type.dot} flex-shrink-0`} />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {type.label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-5 space-y-5">

          {/* Claim Quote */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Claim
            </p>
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50">
              <p className="text-gray-200 text-sm leading-relaxed italic">
                {`"${claim.quote}"`}
              </p>
            </div>
          </div>

          {/* Verdict */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Verdict
            </p>
            <div className={`rounded-lg px-4 py-3 border ${verdict.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{verdict.icon}</span>
                <span className={`text-sm font-semibold ${verdict.color}`}>
                  {verdict.badge}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{claim.short_verdict}</p>
            </div>
          </div>

          {/* Analysis */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Analysis
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {claim.analysis}
            </p>
          </div>

          {/* Bear Case */}
          <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🐻</span>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                Bear Case
              </p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {claim.bear_case}
            </p>
          </div>

          {/* Live Market Data */}
          {claim.web_findings && claim.web_findings.trim().length > 0 && (
            <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">🌐</span>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Live Market Data
                </p>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {claim.web_findings}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-5 py-3 border-t border-gray-800/60">
        <p className="text-gray-600 text-xs text-center">
          Click any highlight to analyze that claim
        </p>
      </div>
    </div>
  );
}