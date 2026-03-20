"use client";
import { useEffect, useRef } from "react";
import { injectHighlights } from "../utils/highlight";

const legendItems = [
  { color: "#f85149", label: "Financial" },
  { color: "#58a6ff", label: "Competitive" },
  { color: "#d29922", label: "Market" },
  { color: "#e3b341", label: "Team" },
];

export default function Document({ text, claims, onClaimClick, activeClaim }) {
  const containerRef = useRef(null);
  const highlightedHtml = injectHighlights(text, claims);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e) => {
      const span = e.target.closest("[data-claim-id]");
      if (!span) return;
      const claim = claims.find((c) => c.id === span.getAttribute("data-claim-id"));
      if (claim) onClaimClick(claim);
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [claims, onClaimClick]);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* Document toolbar */}
      <div className="flex items-center gap-4 px-6 py-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <span className="text-xs font-medium tracking-wider uppercase"
          style={{ color: "var(--text-muted)" }}>
          Document
        </span>
        <div className="w-px h-3" style={{ background: "var(--border-default)" }} />
        <div className="flex items-center gap-4">
          {legendItems.map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--text-muted)" }}>
              <span className="inline-block rounded-sm"
                style={{ width: "10px", height: "3px", background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div
          ref={containerRef}
          className="max-w-2xl mx-auto text-sm leading-7 whitespace-pre-wrap"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'Inter', sans-serif",
          }}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </div>
  );
}