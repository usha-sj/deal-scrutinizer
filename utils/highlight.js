export function injectHighlights(text, claims) {
  if (!text || !claims?.length) return escapeHtml(text);

  const sorted = [...claims].sort((a, b) => b.quote.length - a.quote.length);

  const typeColors = {
    financial: "bg-red-500/20 border-b-2 border-red-500 cursor-pointer hover:bg-red-500/35 transition-colors",
    market: "bg-yellow-500/20 border-b-2 border-yellow-500 cursor-pointer hover:bg-yellow-500/35 transition-colors",
    competitive: "bg-blue-500/20 border-b-2 border-blue-500 cursor-pointer hover:bg-blue-500/35 transition-colors",
    team: "bg-orange-500/20 border-b-2 border-orange-500 cursor-pointer hover:bg-orange-500/35 transition-colors",
  };

  let segments = [{ text, claimId: null, type: null }];

  for (const claim of sorted) {
    const quote = claim.quote?.trim();
    if (!quote || quote.length < 8) continue;

    const newSegments = [];

    for (const seg of segments) {
      if (seg.claimId !== null) {
        newSegments.push(seg);
        continue;
      }

      const match = findMatch(seg.text, quote);

      if (match === -1) {
        newSegments.push(seg);
        continue;
      }

      const matchLength = getMatchLength(seg.text, quote, match);

      newSegments.push({ text: seg.text.slice(0, match), claimId: null, type: null });
      newSegments.push({ text: seg.text.slice(match, match + matchLength), claimId: claim.id, type: claim.type });
      newSegments.push({ text: seg.text.slice(match + matchLength), claimId: null, type: null });
    }

    segments = newSegments;
  }

  return segments
    .map((seg) => {
      if (!seg.text) return "";
      const escaped = escapeHtml(seg.text);
      if (!seg.claimId) return escaped;
      const colorClass = typeColors[seg.type] || typeColors.financial;
      return `<span class="${colorClass} rounded-sm px-0.5" data-claim-id="${seg.claimId}">${escaped}</span>`;
    })
    .join("");
}

// Normalize text for matching - collapse whitespace, lowercase
function normalize(str) {
  return str.replace(/\s+/g, " ").trim().toLowerCase();
}

function findMatch(text, quote) {
  // Try exact match first
  const exactIdx = text.indexOf(quote);
  if (exactIdx !== -1) return exactIdx;

  // Try normalized match
  const normalizedText = normalize(text);
  const normalizedQuote = normalize(quote);

  if (normalizedQuote.length < 8) return -1;

  const normIdx = normalizedText.indexOf(normalizedQuote);
  if (normIdx === -1) {
    // Try first 60 chars of quote (handles truncated quotes)
    const shortQuote = normalizedQuote.slice(0, 60);
    if (shortQuote.length < 8) return -1;
    const shortIdx = normalizedText.indexOf(shortQuote);
    if (shortIdx === -1) return -1;
    return findOriginalIndex(text, shortIdx);
  }

  return findOriginalIndex(text, normIdx);
}

// Map normalized index back to original text index
function findOriginalIndex(text, normalizedIdx) {
  let origIdx = 0;
  let normIdx = 0;

  while (origIdx < text.length && normIdx < normalizedIdx) {
    if (/\s/.test(text[origIdx])) {
      while (origIdx < text.length && /\s/.test(text[origIdx])) origIdx++;
      normIdx++;
    } else {
      origIdx++;
      normIdx++;
    }
  }
  return origIdx;
}

// Get match length in original text for a normalized quote
function getMatchLength(text, quote, startIdx) {
  const normalizedQuote = normalize(quote);
  // Count chars in original text that correspond to normalized quote length
  let origIdx = startIdx;
  let normCount = 0;
  const targetLen = normalizedQuote.length;

  while (origIdx < text.length && normCount < targetLen) {
    if (/\s/.test(text[origIdx])) {
      while (origIdx < text.length && /\s/.test(text[origIdx])) origIdx++;
      normCount++;
    } else {
      origIdx++;
      normCount++;
    }
  }
  return origIdx - startIdx;
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}