import type { FontStyle } from "@/components/header/types";
import { PDFDocument, StandardFonts } from "pdf-lib";

function standardFont(style: FontStyle) {
  if (style === "robotoMono") {
    return StandardFonts.Courier;
  }
  if (style === "times" || style === "georgia") {
    return StandardFonts.TimesRoman;
  }
  return StandardFonts.Helvetica;
}

/**
 * Minimal PDF: one standard font, newline-separated lines, new page when running out of vertical space.
 * (Browser-safe — no `fs`; callers download via Blob.)
 */
export async function buildTextPdf(
  plainText: string,
  fontStyle: FontStyle,
  fontSizePt: number
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(standardFont(fontStyle));
  const size = Math.max(6, fontSizePt);
  const lineHeight = size * 1.25;
  const margin = 50;

  let page = pdf.addPage();
  let { height } = page.getSize();
  let y = height - margin;

  for (const line of plainText.split(/\r?\n/)) {
    if (y < margin) {
      page = pdf.addPage();
      ({ height } = page.getSize());
      y = height - margin;
    }
    page.drawText(line, { x: margin, y, size, font });
    y -= lineHeight;
  }

  return pdf.save();
}
