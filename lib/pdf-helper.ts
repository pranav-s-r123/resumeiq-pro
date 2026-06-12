const pdf = require("pdf-parse");

/**
 * Extract text from PDF buffer
 */
export async function extractPdfText(buffer: Buffer) {
  try {
    const data = await pdf(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF parsing error:", error);
    return "";
  }
}