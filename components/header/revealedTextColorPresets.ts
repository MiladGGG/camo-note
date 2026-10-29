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
  { hex: "#181b8f", darkHex: "#AAD0fd", label: "Blue" },
  { hex: "#000000", darkHex: "#ffffff", label: "Camo" },
  { hex: "#803708", darkHex: "#f0CCA0", label: "Caramel" },
  { hex: "#11632f", darkHex: "#AAefac", label: "Forest" },
  { hex: "#870000", darkHex: "#fca5a5", label: "Hot" },
  { hex: "#7c3aed", darkHex: "#E8C4fe", label: "Violet" },
  { hex: "#0d9488", darkHex: "#6eeaD4", label: "Teal" },
] as const;

export const DEFAULT_REVEALED_TEXT_COLOR_HEX = REVEALED_TEXT_COLOR_PRESETS[0]!.hex;

/** Masked document text in night mode. */
export const DARK_MODE_MASKED_TEXT_COLOR = "#d0d0d0";

export function revealedTextColorForScheme(hex: string, isDark: boolean): string {
  const preset = REVEALED_TEXT_COLOR_PRESETS.find((item) => item.hex === hex);
  if (!preset) {
    return isDark ? DARK_MODE_MASKED_TEXT_COLOR : hex;
  }
  return isDark ? preset.darkHex : preset.hex;
}
