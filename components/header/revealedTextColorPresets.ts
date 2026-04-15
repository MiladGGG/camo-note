export type RevealedTextColorPreset = {
  hex: string;
  label: string;
};

/** Six preset colours for revealed (real) text — swatches shown in the toolbar dropdown. */
export const REVEALED_TEXT_COLOR_PRESETS: readonly RevealedTextColorPreset[] = [
  { hex: "#803708", label: "Caramel" },
  { hex: "#181b8f", label: "Navy" },
  { hex: "#11632f", label: "Forest" },
  { hex: "#870000", label: "Crimson" },
  { hex: "#7c3aed", label: "Violet" },
  { hex: "#0d9488", label: "Teal" },
  { hex: "#2563eb", label: "Blue" },
  { hex: "#000000", label: "Dark" },
] as const;

export const DEFAULT_REVEALED_TEXT_COLOR_HEX = REVEALED_TEXT_COLOR_PRESETS[0]!.hex;
