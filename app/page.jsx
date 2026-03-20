"use client";
import { useState } from "react";
import Upload from "../components/Upload";
import Document from "../components/Document";
import SidePanel from "../components/SidePanel";
import Header from "../components/Header";
import Loading from "../components/Loading";
import {
  ClipboardList, X, Calculator, MessageSquare, AlertTriangle,
  TrendingUp, DollarSign, BarChart2, Activity
} from "lucide-react";

export default function Home() {
  const [state, setState] = useState("upload");
  const [analysis, setAnalysis] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [activeClaim, setActiveClaim] = useState(null);
  const [rightPanel, setRightPanel] = useState("none");

  const handleAnalysisComplete = (data, text) => {
    setAnalysis(data);
    setDocumentText(text);
    setState("results");
    setRightPanel("quickscan");
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
    return <Upload onAnalysisComplete={handleAnalysisComplete} onAnalyzing={handleAnalyzing} />;
  }

  if (state === "loading") return <Loading />;
  if (!analysis) return null;

  const showRightPanel = rightPanel !== "none";

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Header
        summary={analysis.summary}
        companyName={analysis.company_name}
        onReset={handleReset}
        onToggleQuickScan={toggleQuickScan}
        quickScanActive={rightPanel === "quickscan"}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className={`overflow-hidden transition-all duration-300 ${showRightPanel ? "w-3/5" : "w-full"}`}>
          <Document
            text={documentText}
            claims={analysis.claims}
            onClaimClick={handleClaimClick}
            activeClaim={activeClaim}
          />
        </div>

        {showRightPanel && (
          <div className="w-2/5 overflow-hidden" style={{ borderLeft: "1px solid var(--border-default)" }}>
            {rightPanel === "quickscan" && (
              <QuickScanPanel quickScan={analysis.quick_scan} onClose={handleClosePanel} />
            )}
            {rightPanel === "claim" && activeClaim && (
              <SidePanel claim={activeClaim} onClose={handleClosePanel} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  const disclosed = value && value !== "Not disclosed";
  return (
    <div className="px-3 py-2.5 rounded-lg"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className={`text-xs font-semibold leading-snug ${!disclosed ? "italic" : ""}`}
        style={{ color: disclosed ? "var(--text-primary)" : "var(--text-muted)" }}>
        {value || "Not disclosed"}
      </p>
    </div>
  );
}

function SectionLabel({ icon: Icon, label, color }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <Icon size={11} style={{ color: color || "var(--text-muted)" }} />
      <p className="text-xs font-semibold tracking-wider uppercase"
        style={{ color: color || "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

function QuickScanPanel({ quickScan, onClose }) {
  if (!quickScan) return null;

  const financialMetrics = [
    { label: "EBITDA", value: quickScan.ebitda },
    { label: "EBITDA Margin", value: quickScan.ebitda_margin },
    { label: "Net Revenue", value: quickScan.net_revenue },
    { label: "Revenue Growth", value: quickScan.revenue_growth },
    { label: "Operating Cash Flow", value: quickScan.operating_cash_flow },
    { label: "FCF Profile", value: quickScan.fcf_profile },
    { label: "CapEx ($)", value: quickScan.capex_absolute },
    { label: "CapEx Intensity", value: quickScan.capex_intensity },
    { label: "Debt", value: quickScan.debt },
    { label: "Debt / EBITDA", value: quickScan.debt_ebitda },
    { label: "Customer Concentration", value: quickScan.customer_concentration },
    { label: "Market Size", value: quickScan.market_size },
  ];

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-surface)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2">
          <ClipboardList size={13} style={{ color: "var(--accent-gold)" }} />
          <span className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: "var(--text-secondary)" }}>
            Quick Scan
          </span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{
              color: "var(--accent-gold)",
              background: "var(--accent-gold-dim)",
              border: "1px solid var(--accent-gold-border)",
              fontSize: "10px",
              letterSpacing: "0.05em",
            }}>
            PE First Pass
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
        <div className="px-5 py-5 space-y-6">

          {/* Financial Metrics */}
          <div>
            <SectionLabel icon={DollarSign} label="Key Metrics" />
            <div className="grid grid-cols-2 gap-2">
              {financialMetrics.map((m) => (
                <MetricCard key={m.label} label={m.label} value={m.value} />
              ))}
            </div>
          </div>

          {/* Organic vs Acquisition */}
          <div>
            <SectionLabel icon={TrendingUp} label="Organic vs Acquisition Growth" />
            <div className="px-4 py-3 rounded-lg"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-sm leading-relaxed"
                style={{
                  color: quickScan.organic_vs_acquisition && quickScan.organic_vs_acquisition !== "Not disclosed"
                    ? "var(--text-secondary)"
                    : "var(--text-muted)",
                  fontStyle: quickScan.organic_vs_acquisition && quickScan.organic_vs_acquisition !== "Not disclosed"
                    ? "normal" : "italic",
                }}>
                {quickScan.organic_vs_acquisition || "Not disclosed"}
              </p>
            </div>
          </div>

          {/* Competitive Moat */}
          <div>
            <SectionLabel icon={BarChart2} label="Competitive Moat" />
            <div className="px-4 py-3 rounded-lg"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {quickScan.key_differentiator || "Not identified"}
              </p>
            </div>
          </div>

          {/* Management Flag */}
          <div>
            <SectionLabel icon={Activity} label="Management Flag" />
            <div className="px-4 py-3 rounded-lg"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {quickScan.management_flag || "Not identified"}
              </p>
            </div>
          </div>

          {/* Returns Sanity Check */}
          {quickScan.returns_sanity_check && (
            <div>
              <SectionLabel icon={Calculator} label="Returns Sanity Check" color="var(--purple-bright)" />
              <div className="px-4 py-3 rounded-lg"
                style={{ background: "var(--purple-dim)", border: "1px solid var(--purple-border)" }}>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {quickScan.returns_sanity_check}
                </p>
              </div>
            </div>
          )}

          {/* Associate Quick Take */}
          <div>
            <SectionLabel icon={MessageSquare} label="Associate Quick Take" color="var(--blue-bright)" />
            <div className="px-4 py-3 rounded-lg"
              style={{ background: "var(--blue-dim)", border: "1px solid var(--blue-border)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {quickScan.quick_take || ""}
              </p>
            </div>
          </div>

          {/* Missing from Deck */}
          {quickScan.missing_metrics?.length > 0 && (
            <div>
              <SectionLabel icon={AlertTriangle} label="Missing from Deck" color="var(--red-bright)" />
              <div className="px-4 py-3 rounded-lg"
                style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
                <div className="flex flex-wrap gap-1.5">
                  {quickScan.missing_metrics.map((metric, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(248,81,73,0.12)",
                        color: "var(--red-bright)",
                        border: "1px solid var(--red-border)",
                      }}>
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}