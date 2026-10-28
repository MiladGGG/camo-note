export type RevealedTextColorPreset = {
  /** Camouflage against dark masked text (light mode). */
  hex: string;
  /** Camouflage against the dark-mode masked text. */
  darkHex: string;
  label: string;
};

/**
 * Revealed-text colours. Light values sit near dark gray text.
 * Dark values are clearly tinted so they stay readable against the night-mode text.
 */
export const REVEALED_TEXT_COLOR_PRESETS: readonly RevealedTextColorPreset[] = [
  { hex: "#181b8f", darkHex: "#93c5fd", label: "Blue" },
  { hex: "#000000", darkHex: "#ffffff", label: "Camo" },
  { hex: "#803708", darkHex: "#f0b27a", label: "Caramel" },
  { hex: "#11632f", darkHex: "#86efac", label: "Forest" },
  { hex: "#870000", darkHex: "#fca5a5", label: "Hot" },
  { hex: "#7c3aed", darkHex: "#d8b4fe", label: "Violet" },
  { hex: "#0d9488", darkHex: "#5eead4", label: "Teal" },
] as const;

export const DEFAULT_REVEALED_TEXT_COLOR_HEX = REVEALED_TEXT_COLOR_PRESETS[0]!.hex;

/** Masked document text in night mode. */
export const DARK_MODE_MASKED_TEXT_COLOR = "#d4d4d8";

export function revealedTextColorForScheme(hex: string, isDark: boolean): string {
  const preset = REVEALED_TEXT_COLOR_PRESETS.find((item) => item.hex === hex);
  if (!preset) {
    return isDark ? DARK_MODE_MASKED_TEXT_COLOR : hex;
  }
  return isDark ? preset.darkHex : preset.hex;
}
