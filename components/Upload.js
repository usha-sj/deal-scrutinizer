"use client";
import { useState, useRef } from "react";
import { FileText, TrendingDown, Globe, BarChart2, Upload as UploadIcon, AlertCircle } from "lucide-react";
import { extractFromPDF } from "../utils/pdfExtract";

export default function Upload({ onAnalysisComplete, onAnalyzing }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setFileName(file.name);
    setError(null);
    onAnalyzing(true);

    try {
      const { chunks, fullText } = await extractFromPDF(file);

      if (!fullText || fullText.length < 100) {
        throw new Error("Could not extract text from PDF. Try a different file.");
      }

      const payload = JSON.stringify({ chunks, fullText });
      console.log(`Sending payload: ${(payload.length / 1024 / 1024).toFixed(2)}MB`);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chunks, fullText }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Analysis failed");
      }

      const analysis = await response.json();
      onAnalysisComplete(analysis, fullText);
    } catch (err) {
      setError(err.message);
      onAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const features = [
    {
      Icon: TrendingDown,
      label: "Financial Claims",
      desc: "Revenue, EBITDA, growth rates, margins",
      color: "var(--red-bright)",
      dimColor: "var(--red-dim)",
    },
    {
      Icon: Globe,
      label: "Competitive Claims",
      desc: "Market position, moats, competitor gaps",
      color: "var(--blue-bright)",
      dimColor: "var(--blue-dim)",
    },
    {
      Icon: BarChart2,
      label: "Market Claims",
      desc: "TAM/SAM, segment size, growth rates",
      color: "var(--yellow-bright)",
      dimColor: "var(--yellow-dim)",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ background: "var(--bg-base)" }}>

      {/* Header */}
        <div className="mb-14 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
            <img
            src="/sagard.png"
            alt="Sagard"
            style={{ height: "28px" }}
            />
        </div>
        <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "2.5rem",
            fontWeight: 400,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
        }}>
            Deal Scrutinizer
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Upload a CIM. Get an adversarial first-pass analysis.
        </p>
        </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className="w-full max-w-xl cursor-pointer transition-all duration-200 rounded-xl p-12 flex flex-col items-center"
        style={{
          border: isDragging
            ? "1.5px dashed var(--accent-gold)"
            : "1.5px dashed var(--border-default)",
          background: isDragging
            ? "var(--accent-gold-dim)"
            : "var(--bg-surface)",
        }}
        onMouseEnter={e => {
          if (!isDragging) e.currentTarget.style.borderColor = "var(--border-subtle)";
          e.currentTarget.style.background = isDragging ? "var(--accent-gold-dim)" : "var(--bg-elevated)";
        }}
        onMouseLeave={e => {
          if (!isDragging) e.currentTarget.style.borderColor = "var(--border-default)";
          e.currentTarget.style.background = isDragging ? "var(--accent-gold-dim)" : "var(--bg-surface)";
        }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
          <UploadIcon size={20} style={{ color: "var(--text-secondary)" }} />
        </div>

        <p className="font-medium text-base mb-1.5" style={{ color: "var(--text-primary)" }}>
          Drop your CIM here
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          or click to browse — PDF files only
        </p>

        {fileName && (
          <div className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
            <FileText size={13} style={{ color: "var(--text-secondary)" }} />
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{fileName}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg max-w-xl w-full"
          style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)" }}>
          <AlertCircle size={14} style={{ color: "var(--red-bright)" }} />
          <p className="text-sm" style={{ color: "var(--red-bright)" }}>{error}</p>
        </div>
      )}

      {/* Feature cards */}
      <div className="mt-12 grid grid-cols-3 gap-4 max-w-xl w-full">
        {features.map(({ Icon, label, desc, color, dimColor }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: dimColor }}>
              <Icon size={14} style={{ color }} />
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{label}</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs" style={{ color: "var(--text-secondary)" }}>
        AI-powered · Live market data · Adversarial analysis
      </p>
    </div>
  );
}