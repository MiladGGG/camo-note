export type ViewMode = "masked" | "real";
export type MaskStyle = "scientific" | "business" | "pirate" | "acedemic" | "legal" | "news" | "dramatic";
export type FontStyle =
  | "inter"
  | "arial"
  | "helvetica"
  | "calibri"
  | "verdana"
  | "tahoma"
  | "times"
  | "georgia"
  | "robotoMono";

export type EditorSettings = {
  viewMode: ViewMode;
  contextRadius: number;
  fontStyle: FontStyle;
  fontSize: number;
  /** Hex for overlay “real” / revealed text (one of `REVEALED_TEXT_COLOR_PRESETS`). */
  revealedTextColorHex: string;
};
