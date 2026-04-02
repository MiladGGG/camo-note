export type ViewMode = "masked" | "real";
export type MaskStyle = "natural" | "scientific" | "business" | "story" | "pirate";
export type FontStyle =
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
};
