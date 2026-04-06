import type { FontStyle } from "@/components/header/types";

/** Primary family name for RTF / metadata (matches editor presets). */
export function getExportFontFamilyName(style: FontStyle): string {
  switch (style) {
    case "inter":
      return "Inter";
    case "robotoMono":
      return "Roboto Mono";
    case "times":
      return "Times New Roman";
    case "georgia":
      return "Georgia";
    case "calibri":
      return "Calibri";
    case "helvetica":
      return "Helvetica";
    case "arial":
      return "Arial";
    case "tahoma":
      return "Tahoma";
    case "verdana":
      return "Verdana";
  }
}
