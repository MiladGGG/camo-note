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
  /** Canonical light-mode hex. Dark mode uses that preset's `darkHex`. */
  revealedTextColorHex: string;
  /** Replace pointer reading with chunk jumps. */
  readMode: boolean;
};
