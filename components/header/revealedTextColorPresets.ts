export type RevealedTextColorPreset = {
  /** Camouflage against dark masked text (light mode). */
  hex: string;
  /** Camouflage against near-white masked text (dark mode). */
  darkHex: string;
  label: string;
};

/**
 * Revealed-text colours. Light values sit near dark gray text.
 * Dark values are pale tints that sit near white text.
 */
export const REVEALED_TEXT_COLOR_PRESETS: readonly RevealedTextColorPreset[] = [
  { hex: "#803708", darkHex: "#f3e6da", label: "Caramel" },
  { hex: "#181b8f", darkHex: "#e4e6f6", label: "Navy" },
  { hex: "#11632f", darkHex: "#e3f0e7", label: "Forest" },
  { hex: "#870000", darkHex: "#f8e4e4", label: "Crimson" },
  { hex: "#7c3aed", darkHex: "#efe8fb", label: "Violet" },
  { hex: "#0d9488", darkHex: "#e2f3ef", label: "Teal" },
  { hex: "#2563eb", darkHex: "#e4ecfc", label: "Blue" },
  { hex: "#000000", darkHex: "#ffffff", label: "Dark" },
] as const;

export const DEFAULT_REVEALED_TEXT_COLOR_HEX = REVEALED_TEXT_COLOR_PRESETS[0]!.hex;

/** Near-white masked text, so the dark-mode swatches above can blend into it. */
export const DARK_MODE_MASKED_TEXT_COLOR = "#f4f4f5";

export function revealedTextColorForScheme(hex: string, isDark: boolean): string {
  const preset = REVEALED_TEXT_COLOR_PRESETS.find((item) => item.hex === hex);
  if (!preset) {
    return isDark ? DARK_MODE_MASKED_TEXT_COLOR : hex;
  }
  return isDark ? preset.darkHex : preset.hex;
}
