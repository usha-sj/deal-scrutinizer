"use client";
import { useEffect, useRef } from "react";
import { injectHighlights } from "../utils/highlight";

export default function Document({ text, claims, onClaimClick, activeClaim }) {
  const containerRef = useRef(null);

  const highlightedHtml = injectHighlights(text, claims);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const span = e.target.closest("[data-claim-id]");
      if (!span) return;

      const claimId = span.getAttribute("data-claim-id");
      const claim = claims.find((c) => c.id === claimId);
      if (claim) onClaimClick(claim);
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [claims, onClaimClick]);

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Document Header */}
      <div className="px-6 py-3 border-b border-gray-800 flex items-center gap-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider">
          Document
        </p>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-red-500 rounded-full inline-block" />
            <span className="text-gray-500">Financial</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-500 rounded-full inline-block" />
            <span className="text-gray-500">Competitive</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-yellow-500 rounded-full inline-block" />
            <span className="text-gray-500">Market</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-orange-500 rounded-full inline-block" />
            <span className="text-gray-500">Team</span>
          </span>
        </div>
      </div>

      {/* Document Text */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div
        ref={containerRef}
        className="max-w-3xl mx-auto text-gray-300 text-sm leading-7 font-sans whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </div>
  );
}