export type ViewMode = "masked" | "real";
export type MaskStyle = "natural" | "scientific" | "business" | "story" | "pirate";
export type FontStyle = "verdana" | "arial" | "tahoma" | "times" | "georgia" | "courier";

export type EditorSettings = {
  viewMode: ViewMode;
  contextRadius: number;
  fontStyle: FontStyle;
  fontSize: number;
};
