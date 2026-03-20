export default function QuickScan({ quickScan }) {
  if (!quickScan) return null;

  const metrics = [
    { label: "EBITDA", value: quickScan.ebitda },
    { label: "EBITDA Margin", value: quickScan.ebitda_margin },
    { label: "Revenue Growth", value: quickScan.revenue_growth },
    { label: "FCF Profile", value: quickScan.fcf_profile },
    { label: "CapEx Intensity", value: quickScan.capex_intensity },
    { label: "Customer Concentration", value: quickScan.customer_concentration },
    { label: "Market Size", value: quickScan.market_size },
  ];

  const isDisclosed = (val) => val && val !== "Not disclosed";

  return (
    <div className="border-b border-gray-800/60 bg-gray-900/40">
      {/* Key metrics row */}
      <div className="px-6 py-3 grid grid-cols-7 gap-4 border-b border-gray-800/40">
        {metrics.map((m) => (
          <div key={m.label} className="min-w-0">
            <p className="text-gray-500 text-xs mb-0.5 truncate">{m.label}</p>
            <p className={`text-sm font-semibold truncate ${
              isDisclosed(m.value) ? "text-white" : "text-gray-600 italic text-xs"
            }`}>
              {m.value || "Not disclosed"}
            </p>
          </div>
        ))}
      </div>

      {/* Second row — organic growth, moat, management */}
      <div className="px-6 py-3 grid grid-cols-3 gap-6 border-b border-gray-800/40">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Organic vs Acquisition Growth
          </p>
          <p className={`text-sm ${isDisclosed(quickScan.organic_vs_acquisition) ? "text-gray-300" : "text-gray-600 italic"}`}>
            {quickScan.organic_vs_acquisition || "Not disclosed"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Competitive Moat
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {quickScan.key_differentiator || "Not identified"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Management Flag
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {quickScan.management_flag || "Not identified"}
          </p>
        </div>
      </div>

      {/* Returns sanity check */}
      {quickScan.returns_sanity_check && (
        <div className="px-6 py-2.5 border-b border-gray-800/40 bg-purple-950/10">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider mr-2">
            📐 Returns Sanity Check
          </span>
          <span className="text-sm text-gray-300">
            {quickScan.returns_sanity_check}
          </span>
        </div>
      )}

      {/* Quick take */}
      <div className="px-6 py-2.5 border-b border-gray-800/40">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mr-2">
          💬 Associate Quick Take
        </span>
        <span className="text-sm text-gray-300">
          {quickScan.quick_take || ""}
        </span>
      </div>

      {/* Missing metrics */}
      {quickScan.missing_metrics?.length > 0 && (
        <div className="px-6 py-2 bg-red-950/10">
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider mr-2">
            ⚠️ Missing from deck:
          </span>
          <span className="text-xs text-gray-400">
            {quickScan.missing_metrics.join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}