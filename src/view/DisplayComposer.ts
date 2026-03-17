import TextManager from "../buffer/TextManager";

export type ViewMode = "masked" | "real";

export function computeDisplayText(
  manager: TextManager | null,
  viewMode: ViewMode,
  contextRadius: number,
  cursorActive: boolean
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

  const lineByIndex: number[] = [];
  let currentLine = 0;
  for (let i = 0; i < total; i++) {
    const w = words[i];
    if (!w) {
      continue;
    }
    lineByIndex[i] = currentLine;
    const real = (w.realWord as string) ?? "";
    if (real.includes("\n")) {
      currentLine++;
    }
  }
  const cursorLine = lineByIndex[cursorIndex] ?? 0;

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

        if (cursorActive) {
          // always show the cursor word as real
          if (i === cursorIndex) {
            useReal = true;
          }

          // and optionally a radius of surrounding words
          if (
            contextRadius > 0 &&
            Math.abs(i - cursorIndex) <= contextRadius
          ) {
            useReal = true;
          }

          // special line mode: contextRadius === -1 reveals entire current line
          if (contextRadius === -1 && lineByIndex[i] === cursorLine) {
            useReal = true;
          }
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

