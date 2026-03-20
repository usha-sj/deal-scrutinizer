function buildChunkContent(chunk, prompt) {
  const content = [];

  content.push({
    type: "text",
    text: `You are analyzing pages ${chunk.pageRange} of a CIM (Confidential Information Memorandum). Each page is shown as an image with its extracted text. Read everything visible — text, charts, tables, financial figures.\n\nExtracted text for these pages:\n${chunk.text.slice(0, 3000)}`,
  });

  for (const { page, base64 } of chunk.images) {
    content.push({
      type: "text",
      text: `--- Page ${page} ---`,
    });
    content.push({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: base64 },
    });
  }

  content.push({ type: "text", text: prompt });
  return content;
}

async function callClaude(content, maxTokens = 3000) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: "You are a JSON API. Output ONLY raw JSON. Never use markdown code blocks or backticks. Never write prose. Start your response with { and end with }. Any other format will break the system.",
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content }],
    }),
  });

  // ADD THIS:
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude API error:", errorText);
    return null;
  }

  const data = await response.json();
  
  // ADD THIS:
  console.log("Claude response stop_reason:", data.stop_reason, "content blocks:", data.content?.length);

  let resultText = "";
  for (const block of data.content) {
    if (block.type === "text") resultText += block.text;
  }

  // ADD THIS:
  console.log("Result text preview:", resultText?.slice(0, 100));

const first = resultText.indexOf("{");
const last = resultText.lastIndexOf("}");
if (first === -1 || last === -1) {
  console.error("No JSON braces found");
  return null;
}

try {
  return JSON.parse(resultText.slice(first, last + 1));
} catch (e) {
  // Try to salvage truncated claims array
  try {
    const claimsStart = resultText.indexOf('"claims"');
    if (claimsStart === -1) return null;
    
    // Find all complete claim objects
    const arrayStart = resultText.indexOf("[", claimsStart);
    if (arrayStart === -1) return null;
    
    // Walk through and find complete objects
    const claims = [];
    let depth = 0;
    let objStart = -1;
    
    for (let i = arrayStart; i < resultText.length; i++) {
      if (resultText[i] === "{") {
        if (depth === 0) objStart = i;
        depth++;
      } else if (resultText[i] === "}") {
        depth--;
        if (depth === 0 && objStart !== -1) {
          try {
            const obj = JSON.parse(resultText.slice(objStart, i + 1));
            claims.push(obj);
          } catch {}
          objStart = -1;
        }
      }
    }
    
    if (claims.length > 0) {
      console.log(`Salvaged ${claims.length} claims from truncated response`);
      return { claims };
    }
  } catch {}
  
  console.error("JSON parse failed completely:", e.message);
  return null;
}
}

function clean(str) {
  if (typeof str !== "string") return str;
  return str.replace(/<cite[^>]*>|<\/cite>/g, "").trim();
}

const CLAIMS_PROMPT = `You are a seasoned PE associate stress-testing claims in this section of a CIM.

PE ANALYSTS READ CIMs IN THIS ORDER:
1. Financials first — EBITDA, margins, revenue growth, FCF, CapEx
2. Competitive differentiation — why does this business exist?
3. Market dynamics — size, growth rate, tailwinds
4. Management credibility
5. Red flags and missing information

YOUR JOB: Find 6-10 verifiable claims in this section.

ALWAYS FLAG:
- Any EBITDA, revenue, margin, or FCF figure
- Revenue growth rates — flag if organic vs acquisition-driven is unclear
- Fee structures or pricing claims ("35-50 bps", "10% commission")
- Market size figures (TAM/SAM/SOM) — flag if no source cited
- "Fastest growing", "market leader", "only solution", "first to market" superlatives  
- Customer concentration or retention figures
- Named competitors and what is claimed about them
- Competitors NOT mentioned that should be (flag the absence)
- Management backgrounds and previous company metrics
- FCF generation vs CapEx relationship
- Acquisition-driven vs organic growth conflation
- Projections that assume hockey-stick growth without explanation
- Adjusted EBITDA add-backs that seem aggressive

DO NOT FLAG:
- Generic statements ("we use technology", "customer focused", "experienced team")
- Standard industry history
- Obvious facts requiring no verification

WEB SEARCH: Use for 2-3 most important claims only. Search for:
- Named competitors + their actual metrics
- Market size figures + their source
- Named executives to verify backgrounds
- Fee comparisons to market rates

VERDICT RULES:
- CONTRADICTED: external evidence materially conflicts — wrong direction, wrong order of magnitude, demonstrably false. Minor timeline differences are NOT contradictions.
- UNVERIFIED: cannot confirm or deny from available sources
- SUPPORTED: external evidence confirms the claim

BEAR CASE: Must name (1) the specific mechanism of failure, (2) affected stakeholder, (3) realistic timeline. No generic risks.

QUOTE RULE: Quote exact text under 80 characters. Short, distinctive phrases match better than long sentences.

Return ONLY valid JSON:
{
  "claims": [
    {
      "id": "string",
      "quote": "exact verbatim text under 80 chars",
      "type": "financial | market | competitive | team",
      "verdict": "supported | unverified | contradicted",
      "short_verdict": "5 words max",
      "analysis": "2-3 sentences adversarial and specific",
      "bear_case": "2-3 sentences with mechanism, stakeholder, timeline",
      "web_findings": "what search found or empty string"
    }
  ]
}`;

const QUICK_SCAN_PROMPT = `You are a PE associate doing a 60-second financial flip-through of a CIM.

Extract exactly these fields. Use "Not disclosed" if genuinely absent. Never fabricate numbers.

PE FIRST-PASS CHECKLIST:
- EBITDA and margins (target: 20%+ margins)
- Revenue growth (target: 10%+ CAGR)
- FCF profile (EBITDA minus CapEx — key for LBO math)
- CapEx intensity (target: under 5% of revenue)
- Customer concentration (top customer as % of revenue)
- Organic vs acquisition-driven growth (flag if unclear)
- Market tailwinds (is the industry growing?)
- Competitive moat (why does this business exist?)

RETURNS SANITY CHECK: If EBITDA and valuation/size data is available, do rough LBO math:
- Assume 5x leverage, 5-year hold, same exit multiple
- Does a 20% IRR seem achievable?
- If data insufficient, state what would need to be true

MISSING METRICS: Flag what a PE investor would want that is absent from this CIM.
Common missing items: gross retention, NRR, organic growth rate, CapEx breakdown, customer count, ARR, working capital, cash conversion.

Return ONLY valid JSON:
{
  "company_name": "string",
  "quick_scan": {
    "ebitda": "string",
    "ebitda_margin": "string",
    "revenue_growth": "string",
    "fcf_profile": "string",
    "capex_intensity": "string",
    "customer_concentration": "string",
    "organic_vs_acquisition": "string",
    "market_size": "string",
    "key_differentiator": "string",
    "management_flag": "string",
    "returns_sanity_check": "string",
    "missing_metrics": ["string"],
    "quick_take": "2-3 sentence honest first impression as a PE associate"
  }
}`;

export async function POST(request) {
  try {
    const { chunks, fullText } = await request.json();

    if (!chunks || chunks.length === 0) {
      return Response.json({ error: "No document content received" }, { status: 400 });
    }

    console.log(`Processing ${chunks.length} chunks in parallel...`);
    chunks.forEach((chunk, i) => {
    console.log(`Chunk ${i}: pages ${chunk.pageRange}, text length: ${chunk.text?.length || 0}, images: ${chunk.images?.length || 0}`);
    });
    // Fire everything in parallel:
    // - Quick scan on full text (no images needed, just text)
    // - Claims analysis on each chunk (text + images together)
    const [quickScanResult, ...claimResults] = await Promise.all([
      // Quick scan — text only, no images needed
      callClaude(
        `${QUICK_SCAN_PROMPT}\n\nFULL DOCUMENT TEXT:\n${fullText.slice(0, 8000)}`,
        1500
      ),
      // Each chunk analyzed with its own pages + images
      ...chunks.map((chunk) =>
        callClaude(buildChunkContent(chunk, CLAIMS_PROMPT), 4000)
      ),
    ]);

    console.log("quickScanResult:", JSON.stringify(quickScanResult)?.slice(0, 200));
    claimResults.forEach((r, i) => {
        console.log(`claimResult ${i}:`, JSON.stringify(r)?.slice(0, 200));
    });
    // Merge all claims
    let allClaims = claimResults.flatMap((r) => r?.claims || []);

    // Deduplicate by quote similarity
    const seen = new Set();
    allClaims = allClaims.filter((claim) => {
      const key = normalize(claim.quote?.slice(0, 50) || "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Clean citation tags from all string fields
    allClaims = allClaims.map((claim) => ({
      ...claim,
      analysis: clean(claim.analysis),
      bear_case: clean(claim.bear_case),
      web_findings: clean(claim.web_findings),
    }));

    // Build summary
    const contradicted = allClaims.filter((c) => c.verdict === "contradicted").length;
    const unverified = allClaims.filter((c) => c.verdict === "unverified").length;
    const supported = allClaims.filter((c) => c.verdict === "supported").length;

    const recommendation =
      contradicted >= 3 ? "pass" :
      contradicted >= 1 || unverified >= 5 ? "investigate_further" :
      "proceed";

    // Clean quick scan
    const quickScan = quickScanResult?.quick_scan || null;
    if (quickScan) {
      Object.keys(quickScan).forEach((key) => {
        if (typeof quickScan[key] === "string") {
          quickScan[key] = clean(quickScan[key]);
        }
      });
    }

    const headline =
      quickScan?.quick_take?.split(".")?.[0] ||
      `${contradicted} contradicted · ${unverified} unverified across ${allClaims.length} claims`;

    return Response.json({
      company_name: quickScanResult?.company_name || "Company",
      quick_scan: quickScan,
      summary: {
        total_claims: allClaims.length,
        contradicted,
        unverified,
        supported,
        overall_recommendation: recommendation,
        headline_finding: headline,
      },
      claims: allClaims,
    });

  } catch (error) {
    console.error("Route error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function normalize(str) {
  return str?.replace(/\s+/g, " ").trim().toLowerCase() || "";
}