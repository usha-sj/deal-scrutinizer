export default function Header({ summary, companyName, onReset, onToggleQuickScan, quickScanActive }) {  const verdictConfig = {
    proceed: {
      label: "Proceed to Diligence",
      icon: "✅",
      color: "text-green-300 bg-green-950/40 border-green-800/50",
    },
    investigate_further: {
      label: "Investigate Further",
      icon: "⚠️",
      color: "text-yellow-300 bg-yellow-950/40 border-yellow-800/50",
    },
    pass: {
      label: "Pass",
      icon: "🚫",
      color: "text-red-300 bg-red-950/40 border-red-800/50",
    },
  };

  const verdict = verdictConfig[summary.overall_recommendation] || verdictConfig.investigate_further;

    return (
    <div className="bg-gray-900 border-b border-gray-800/60 px-6 py-3 flex flex-col gap-1.5">
        {/* Top row */}
        <div className="flex items-center gap-4">
        <h1 className="text-white font-bold text-base flex-shrink-0">
            {companyName || "Deal Analysis"}
        </h1>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${verdict.color}`}>
            {verdict.icon} {verdict.label}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Counts */}
        <div className="flex items-center gap-5 flex-shrink-0">
            {[
            { val: summary.total_claims, label: "Claims", color: "text-white" },
            { val: summary.contradicted, label: "Contradicted", color: "text-red-400" },
            { val: summary.unverified, label: "Unverified", color: "text-yellow-400" },
            { val: summary.supported, label: "Supported", color: "text-green-400" },
            ].map((s) => (
            <div key={s.label} className="text-center">
                <p className={`font-bold text-lg leading-none ${s.color}`}>{s.val}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
            ))}
        </div>

        {/* Buttons */}
        <button
            onClick={onToggleQuickScan}
            className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-lg transition-colors border ${
            quickScanActive
                ? "bg-blue-900/50 text-blue-300 border-blue-700/50"
                : "bg-gray-800 text-gray-400 hover:text-gray-200 border-gray-700/50"
            }`}
        >
            📋 Quick Scan
        </button>

        <button
            onClick={onReset}
            className="flex-shrink-0 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 text-xs rounded-lg transition-colors border border-gray-700/50"
        >
            ← New Deal
        </button>
        </div>

        {/* Headline finding — full width second line */}
        <p className="text-gray-400 text-sm leading-relaxed">
        {summary.headline_finding}
        </p>
    </div>
    );
}