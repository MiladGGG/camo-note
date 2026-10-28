import TextManager from "../buffer/TextManager";
import { CONTEXT_RADIUS_LINE, CONTEXT_RADIUS_NONE } from "./contextRadius";

/**
 * Hover-to-reveal, kept in this file so it can be removed on its own.
 * To roll it back: delete this file and `MouseRevealControl`, then drop the
 * `mouseReveal` setting and the pointer handlers in `SingleMixedEditor`.
 * `computeDisplayChunks` already treats a missing extra-reveal set as off.
 * The radius argument is the editor context radius, including the line and none modes.
 */

type Token = {
  index: number;
  start: number;
  maskable: boolean;
  ordinal: number;
};

function tokensOf(manager: TextManager): Token[] {
  const words = manager.words as Array<{ realWord?: string; maskedWord?: string } | undefined>;
  const tokens: Token[] = [];
  let abs = 0;
  let ordinal = 0;

  const total = manager.length;
  for (let i = 0; i < total; i++) {
    const word = words[i];
    if (!word) {
      continue;
    }
    const length = (word.realWord ?? "").length;
    const maskable = "maskedWord" in word;
    tokens.push({
      index: i,
      start: abs,
      maskable,
      ordinal: maskable ? ordinal : -1,
    });
    if (maskable) {
      ordinal++;
    }
    abs += length;
  }

  return tokens;
}

/** Maskable word indexes on the same line, within `radius` of the word at `offset`. */
export function wordIndexesAroundOffset(
  manager: TextManager,
  offset: number,
  radius: number
): Set<number> {
  if (radius === CONTEXT_RADIUS_NONE) {
    return new Set();
  }

  const tokens = tokensOf(manager);
  if (tokens.length === 0) {
    return new Set();
  }

  let hit = tokens.findIndex((token, i) => {
    const next = tokens[i + 1]?.start ?? Number.POSITIVE_INFINITY;
    return offset >= token.start && offset < next;
  });
  if (hit === -1 && offset >= 0) {
    hit = tokens.length - 1;
  }
  if (hit === -1) {
    return new Set();
  }

  let anchor = tokens[hit]!;
  if (!anchor.maskable) {
    let found: Token | undefined;
    for (let i = hit + 1; i < tokens.length; i++) {
      const candidate = tokens[i]!;
      if (!manager.isSameLine(offset, candidate.start)) {
        break;
      }
      if (candidate.maskable) {
        found = candidate;
        break;
      }
    }
    if (!found) {
      for (let i = hit - 1; i >= 0; i--) {
        const candidate = tokens[i]!;
        if (!manager.isSameLine(offset, candidate.start)) {
          break;
        }
        if (candidate.maskable) {
          found = candidate;
          break;
        }
      }
    }
    if (!found) {
      return new Set();
    }
    anchor = found;
  }

  const revealed = new Set<number>();
  for (const token of tokens) {
    if (!token.maskable || token.ordinal < 0) {
      continue;
    }
    if (!manager.isSameLine(anchor.start, token.start)) {
      continue;
    }
    const span = radius === CONTEXT_RADIUS_LINE ? Number.POSITIVE_INFINITY : radius;
    if (Math.abs(token.ordinal - anchor.ordinal) <= span) {
      revealed.add(token.index);
    }
  }
  return revealed;
}

function rangeFromPoint(doc: Document, x: number, y: number): Range | null {
  const withCaret = doc as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (
      x: number,
      y: number
    ) => { offsetNode: Node; offset: number } | null;
  };

  if (withCaret.caretRangeFromPoint) {
    return withCaret.caretRangeFromPoint(x, y);
  }

  const position = withCaret.caretPositionFromPoint?.(x, y);
  if (!position) {
    return null;
  }
  const range = doc.createRange();
  range.setStart(position.offsetNode, position.offset);
  range.collapse(true);
  return range;
}

/**
 * Character offset in the editor's displayed text (newlines included)
 * for a viewport point. Returns null when the point is not over text.
 */
export function selectClientPoint(editable: HTMLElement, x: number, y: number): void {
  const range = rangeFromPoint(editable.ownerDocument, x, y);
  if (!range || !editable.contains(range.startContainer)) {
    return;
  }
  const selection = editable.ownerDocument.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export function displayOffsetFromClientPoint(
  editable: HTMLElement,
  x: number,
  y: number
): number | null {
  const doc = editable.ownerDocument;
  const caret = rangeFromPoint(doc, x, y);
  if (!caret || !editable.contains(caret.startContainer)) {
    return null;
  }

  const blocks = editable.querySelectorAll(':scope > [data-slate-node="element"]');
  if (blocks.length === 0) {
    return null;
  }

  let offset = 0;
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    if (blockIndex > 0) {
      offset += 1;
    }
    const walker = doc.createTreeWalker(blocks[blockIndex]!, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if ((node as Text).parentElement?.closest("[data-slate-placeholder]")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const length = node.textContent?.length ?? 0;
      if (node === caret.startContainer) {
        return offset + Math.min(caret.startOffset, length);
      }
      offset += length;
    }
  }

  return null;
}

/**
 * Moving past the right edge continues at the left edge on the next line.
 * Moving past the left edge continues at the right edge on the previous line.
 */
export function wrapPortalPoint(
  x: number,
  y: number,
  left: number,
  right: number,
  lineHeight: number
): { x: number; y: number } {
  const width = right - left;
  if (width <= 0 || lineHeight <= 0) {
    return { x, y };
  }

  let nextX = x;
  let nextY = y;
  while (nextX >= right) {
    nextX -= width;
    nextY += lineHeight;
  }
  while (nextX < left) {
    nextX += width;
    nextY -= lineHeight;
  }
  return { x: nextX, y: nextY };
}

export function sameWordIndexSet(
  current: ReadonlySet<number> | null,
  next: ReadonlySet<number> | null
): boolean {
  if (current === next) {
    return true;
  }
  if (!current || !next || current.size !== next.size) {
    return false;
  }
  for (const index of next) {
    if (!current.has(index)) {
      return false;
    }
  }
  return true;
}
