"use client";
import { useState, useRef } from "react";
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
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-8">
      {/* Logo / Title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Deal Scrutinizer
        </h1>
        <p className="text-gray-400 text-lg">
          Drop in a CIM. Get an adversarial analysis.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          w-full max-w-2xl border-2 border-dashed rounded-2xl p-16
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? "border-blue-400 bg-blue-950/30"
            : "border-gray-700 bg-gray-900 hover:border-gray-500 hover:bg-gray-800"
          }
        `}
      >
        <div className="text-6xl mb-6">📄</div>
        <p className="text-white text-xl font-medium mb-2">
          Drop your CIM here
        </p>
        <p className="text-gray-500 text-sm">
          or click to browse — PDF files only
        </p>

        {fileName && (
          <div className="mt-6 px-4 py-2 bg-gray-800 rounded-lg">
            <p className="text-gray-300 text-sm">📎 {fileName}</p>
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
        <div className="mt-6 px-6 py-3 bg-red-950 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Context */}
      <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl w-full">
        {[
          { icon: "🔴", label: "Financial Claims", desc: "Revenue, NRR, growth rates" },
          { icon: "🔵", label: "Competitive Claims", desc: "Market position, moats" },
          { icon: "🟡", label: "Market Claims", desc: "TAM, segment size" },
        ].map((item) => (
          <div key={item.label} className="bg-gray-900 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-white text-sm font-medium">{item.label}</p>
            <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}