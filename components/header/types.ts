export type ViewMode = "masked" | "real";
/** Auto follows the system theme. Dark and light force that appearance. */
export type ColorMode = "auto" | "dark" | "light";
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
  colorMode: ColorMode;
  /** Reveal words around the pointer without clicking. */
  mouseReveal: boolean;
};
