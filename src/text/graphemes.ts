const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

const EMOJI_GRAPHEME = /[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}\uFE0F\u20E3\u200D]/u;

export function graphemeSegments(text: string): string[] {
  return [...segmenter.segment(text)].map((part) => part.segment);
}

export function isEmojiGrapheme(segment: string): boolean {
  return EMOJI_GRAPHEME.test(segment);
}

/** UTF-16 bounds of the grapheme before or after `index`, including a caret sitting inside one. */
export function graphemeBounds(
  text: string,
  index: number,
  direction: "backward" | "forward",
): { start: number; end: number } | null {
  let start = 0;
  for (const { segment } of segmenter.segment(text)) {
    const end = start + segment.length;
    const endsHere = direction === "backward" && end === index;
    const startsHere = direction === "forward" && start === index;
    const coversCaret = start < index && index < end;
    if (endsHere || startsHere || coversCaret) {
      return { start, end };
    }
    start = end;
  }
  return null;
}
