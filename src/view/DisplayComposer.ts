import TextManager from "../buffer/TextManager";

export type ViewMode = "masked" | "real";

export type DisplayChunk = {
  text: string;
  // True when the chunk is showing real text (as opposed to masked text).
  isReal: boolean;
};

export function computeDisplayChunks(
  manager: TextManager | null,
  viewMode: ViewMode,
  contextRadius: number,
  cursorActive: boolean
): DisplayChunk[] {
  if (!manager) {
    return [];
  }

  const total = manager.length;
  if (total === 0) {
    return [];
  }

  const words = manager.words as any[];
  const cursorIndex = manager.currentWordIndex;
  const cursorAbs = manager.cursor;

  // Track absolute start cursor position per token.
  const tokenStartByIndex: number[] = [];
  let abs = 0;
  for (let i = 0; i < total; i++) {
    const w = words[i];
    if (!w) continue;
    tokenStartByIndex[i] = abs;
    abs += ((w.realWord as string) ?? "").length;
  }

  // Track ordinal positions of text words only (ignore delimiters)
  const wordOrdinalByIndex: number[] = [];
  let wordOrdinal = 0;
  for (let i = 0; i < total; i++) {
    const w = words[i];
    if (!w) {
      continue;
    }
    const hasMasked = "maskedWord" in w;
    if (hasMasked) {
      wordOrdinalByIndex[i] = wordOrdinal;
      wordOrdinal++;
    } else {
      wordOrdinalByIndex[i] = -1;
    }
  }

  // If cursor is currently on a delimiter, anchor reveal behavior to a nearby
  // maskable word on the same line as the caret.
  let effectiveCursorIndex = cursorIndex;
  const cursorOrdinal = wordOrdinalByIndex[cursorIndex];

  if (cursorOrdinal === -1) {
    // Prefer the next maskable word to the right on the same line.
    for (let i = cursorIndex + 1; i < total; i++) {
      const start = tokenStartByIndex[i] ?? 0;
      if (wordOrdinalByIndex[i] !== -1 && manager.isSameLine(cursorAbs, start)) {
        effectiveCursorIndex = i;
        break;
      }
    }

    // If there is no word to the right on this line, try the previous one
    // on the same line (still never crossing '\n').
    if (effectiveCursorIndex === cursorIndex) {
      for (let i = cursorIndex - 1; i >= 0; i--) {
        const start = tokenStartByIndex[i] ?? 0;
        if (wordOrdinalByIndex[i] !== -1 && manager.isSameLine(cursorAbs, start)) {
          effectiveCursorIndex = i;
          break;
        }
      }
    }
  }

  const cursorWordOrdinal = wordOrdinalByIndex[effectiveCursorIndex];

  const chunks: DisplayChunk[] = [];

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
          if (i === effectiveCursorIndex) {
            useReal = true;
          }

          // and optionally a radius of surrounding TEXT words (ignore delimiters)
          if (contextRadius > 0 && cursorWordOrdinal >= 0) {
            const thisOrdinal = wordOrdinalByIndex[i];
            const start = tokenStartByIndex[i] ?? 0;
            if (
              manager.isSameLine(cursorAbs, start) &&
              thisOrdinal >= 0 &&
              Math.abs(thisOrdinal - cursorWordOrdinal) <= contextRadius
            ) {
              useReal = true;
            }
          }

          // special line mode: contextRadius === -1 reveals entire current line
          if (contextRadius === -1) {
            const start = tokenStartByIndex[i] ?? 0;
            if (manager.isSameLine(cursorAbs, start)) {
              useReal = true;
            }
          }
        }
      }
    }

    const segmentText = useReal
      ? w.realWord
      : hasMasked
        ? (w.maskedWord as string)
        : w.realWord;

    chunks.push({ text: segmentText, isReal: useReal });
  }

  return chunks;
}

export function computeDisplayText(
  manager: TextManager | null,
  viewMode: ViewMode,
  contextRadius: number,
  cursorActive: boolean
): string {
  return computeDisplayChunks(manager, viewMode, contextRadius, cursorActive)
    .map((c) => c.text)
    .join("");
}

