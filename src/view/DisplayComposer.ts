import TextManager from "../buffer/TextManager";

export type ViewMode = "masked" | "real";

export function computeDisplayText(
  manager: TextManager | null,
  viewMode: ViewMode,
  contextRadius: number
): string {
  if (!manager) {
    return "";
  }

  const total = manager.length;
  if (total === 0) {
    return "";
  }

  const words = manager.words as any[];
  const cursorIndex = manager.currentWordIndex;

  const parts: string[] = [];

  for (let i = 0; i < total; i++) {
    const w = words[i];
    if (!w) {
      continue;
    }

    const hasMasked = "maskedWord" in w;
    const isDelimiter = !hasMasked;

    let useReal = false;

    if (viewMode === "real") {
      useReal = true;
    } else {
      if (isDelimiter) {
        useReal = true;
      } else {
        // maskable word in masked mode
        useReal = false;

        // always show the cursor word as real
        if (i === cursorIndex) {
          useReal = true;
        }

        // and optionally a radius of surrounding words
        if (contextRadius > 0 && Math.abs(i - cursorIndex) <= contextRadius) {
          useReal = true;
        }
      }
    }

    const segment = useReal
      ? w.realWord
      : hasMasked
      ? (w.maskedWord as string)
      : w.realWord;

    parts.push(segment);
  }

  return parts.join("");
}

