"use client";
import { useEffect, useState } from "react";

const messages = [
  "Rendering PDF pages...",
  "Reading charts and visual data...",
  "Identifying verifiable claims...",
  "Running live market checks...",
  "Cross-referencing competitor data...",
  "Stress-testing financial claims...",
  "Generating bear cases...",
  "Finalizing adversarial analysis...",
];

export default function Loading() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-8" />

      {/* Message */}
      <p className="text-white text-lg font-medium mb-2">
        Scrutinizing deal...
      </p>
      <p className="text-gray-500 text-sm transition-all duration-300">
        {messages[msgIndex]}
      </p>

      {/* Warning */}
      <div className="mt-12 px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg max-w-sm text-center">
        <p className="text-gray-500 text-xs">
          Running live web searches across market data sources.
          This takes 30–60 seconds.
        </p>
      </div>
    </div>
  );
}