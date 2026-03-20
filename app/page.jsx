"use client";
import { useState } from "react";
import Upload from "../components/Upload";
import Document from "../components/Document";
import SidePanel from "../components/SidePanel";
import Header from "../components/Header";
import Loading from "../components/Loading";
import QuickScan from "../components/QuickScan";

export default function Home() {
  const [state, setState] = useState("upload");
  const [analysis, setAnalysis] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [activeClaim, setActiveClaim] = useState(null);
  const [rightPanel, setRightPanel] = useState("none"); // "none" | "claim" | "quickscan"

  const handleAnalysisComplete = (data, text) => {
    setAnalysis(data);
    setDocumentText(text);
    setState("results");
    setRightPanel("quickscan"); // open quick scan by default
  };

  const handleAnalyzing = (isAnalyzing) => {
    if (isAnalyzing) setState("loading");
  };

  const handleReset = () => {
    setState("upload");
    setAnalysis(null);
    setDocumentText("");
    setActiveClaim(null);
    setRightPanel("none");
  };

  const handleClaimClick = (claim) => {
    setActiveClaim(claim);
    setRightPanel("claim");
  };

  const handleClosePanel = () => {
    setActiveClaim(null);
    setRightPanel("none");
  };

  const toggleQuickScan = () => {
    if (rightPanel === "quickscan") {
      setRightPanel("none");
    } else {
      setRightPanel("quickscan");
      setActiveClaim(null);
    }
  };

  if (state === "upload") {
    return (
      <Upload
        onAnalysisComplete={handleAnalysisComplete}
        onAnalyzing={handleAnalyzing}
      />
    );
  }

  if (state === "loading") return <Loading />;
  if (!analysis) return null;

  const showRightPanel = rightPanel !== "none";

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <Header
        summary={analysis.summary}
        companyName={analysis.company_name}
        onReset={handleReset}
        onToggleQuickScan={toggleQuickScan}
        quickScanActive={rightPanel === "quickscan"}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Document */}
        <div className={`overflow-hidden transition-all duration-300 ${
          showRightPanel ? "w-3/5" : "w-full"
        }`}>
          <Document
            text={documentText}
            claims={analysis.claims}
            onClaimClick={handleClaimClick}
            activeClaim={activeClaim}
          />
        </div>

        {/* Right: Panel (Quick Scan or Claim) */}
        {showRightPanel && (
          <div className="w-2/5 overflow-hidden border-l border-gray-800/60">
            {rightPanel === "quickscan" && (
              <QuickScanPanel
                quickScan={analysis.quick_scan}
                onClose={handleClosePanel}
              />
            )}
            {rightPanel === "claim" && activeClaim && (
              <SidePanel
                claim={activeClaim}
                onClose={handleClosePanel}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// QuickScan as a side panel with scroll
function QuickScanPanel({ quickScan, onClose }) {
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
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <span className="text-sm">📋</span>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Quick Scan
          </span>
          <span className="text-xs text-gray-500 ml-1">PE First Pass</span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4 space-y-5">

          {/* Key Metrics */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Key Metrics
            </p>
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-gray-800/50 rounded-lg px-3 py-2.5 border border-gray-700/50"
                >
                  <p className="text-gray-500 text-xs mb-0.5">{m.label}</p>
                  <p className={`text-sm font-semibold ${
                    isDisclosed(m.value) ? "text-white" : "text-gray-600 italic text-xs font-normal"
                  }`}>
                    {m.value || "Not disclosed"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Organic vs Acquisition */}
          <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Organic vs Acquisition Growth
            </p>
            <p className={`text-sm ${isDisclosed(quickScan.organic_vs_acquisition) ? "text-gray-300" : "text-gray-600 italic"}`}>
              {quickScan.organic_vs_acquisition || "Not disclosed"}
            </p>
          </div>

          {/* Competitive Moat */}
          <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Competitive Moat
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {quickScan.key_differentiator || "Not identified"}
            </p>
          </div>

          {/* Management Flag */}
          <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Management Flag
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {quickScan.management_flag || "Not identified"}
            </p>
          </div>

          {/* Returns Sanity Check */}
          {quickScan.returns_sanity_check && (
            <div className="bg-purple-950/30 border border-purple-900/40 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1.5">
                📐 Returns Sanity Check
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {quickScan.returns_sanity_check}
              </p>
            </div>
          )}

          {/* Associate Quick Take */}
          <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg px-4 py-3">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
              💬 Associate Quick Take
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {quickScan.quick_take || ""}
            </p>
          </div>

          {/* Missing Metrics */}
          {quickScan.missing_metrics?.length > 0 && (
            <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                ⚠️ Missing from Deck
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickScan.missing_metrics.map((metric, i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-950/50 text-red-300 px-2 py-0.5 rounded-full border border-red-900/40"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}