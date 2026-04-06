import { getExportFontFamilyName } from "./fontExportMeta";
import type { FontStyle } from "@/components/header/types";

function escapeRtfText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\n/g, "\\par\n");
}

function escapeRtfFontName(name: string): string {
  return name.replace(/\\/g, "\\\\").replace(/{/g, "\\{").replace(/}/g, "\\}");
}

/**
 * Minimal RTF with one font, size in half-points, plain body.
 */
export function buildRtfDocument(
  plainText: string,
  fontStyle: FontStyle,
  fontSizePt: number
): string {
  const fontName = escapeRtfFontName(getExportFontFamilyName(fontStyle));
  const fsHalf = Math.max(2, Math.round(fontSizePt * 2));
  const body = escapeRtfText(plainText);
  return (
    "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 " +
    fontName +
    ";}}\\f0\\fs" +
    String(fsHalf) +
    "\n" +
    body +
    "\n}"
  );
}
