export async function extractFromPDF(file) {
  if (typeof window === "undefined") {
    throw new Error("PDF extraction must run in the browser");
  }

  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const numPages = pdf.numPages;
  const pages = [];

  // Extract text + render image for EVERY page
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // Extract text
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .replace(/- /g, "")
      .trim();

    // Render as image
    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = document.createElement("canvas");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport,
    }).promise;

    const base64 = canvas.toDataURL("image/jpeg", 0.55).split(",")[1];

    pages.push({ pageNum, text, base64 });
  }

  // Split pages into 3 roughly equal chunks
  const chunkSize = Math.ceil(pages.length / 3);
  const chunks = [];

  for (let i = 0; i < pages.length; i += chunkSize) {
    const chunkPages = pages.slice(i, i + chunkSize);
    chunks.push({
      pages: chunkPages,
      text: chunkPages.map((p) => `[Page ${p.pageNum}]\n${p.text}`).join("\n\n"),
      images: chunkPages.map((p) => ({ page: p.pageNum, base64: p.base64 })),
      pageRange: `${chunkPages[0].pageNum}-${chunkPages[chunkPages.length - 1].pageNum}`,
    });
  }

  // Full text for quick scan (all pages)
  const fullText = pages
    .map((p) => `[Page ${p.pageNum}]\n${p.text}`)
    .join("\n\n");

  return { chunks, fullText };
}