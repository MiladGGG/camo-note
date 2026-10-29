import TextManager from "../buffer/TextManager";
import { CONTEXT_RADIUS_LINE, CONTEXT_RADIUS_NONE } from "./contextRadius";

/**
 * How many maskable words a read-mode arrow moves.
 * A radius of 5 shows five words on each side, so the caret jumps ten words.
 * Radius 0 shows only the current word, so the caret jumps one.
 */
export function readJumpLength(contextRadius: number): number | "line" | "none" {
  if (contextRadius === CONTEXT_RADIUS_NONE) {
    return "none";
  }
  if (contextRadius === CONTEXT_RADIUS_LINE) {
    return "line";
  }
  return contextRadius > 0 ? contextRadius * 2 : 1;
}

function maskableStarts(manager: TextManager): number[] {
  const tokens = manager.words as Array<{ realWord?: string; maskedWord?: string } | undefined>;
  const starts: number[] = [];
  let abs = 0;
  for (let i = 0; i < manager.length; i++) {
    const token = tokens[i];
    if (!token) {
      continue;
    }
    const text = token.realWord ?? "";
    if ("maskedWord" in token && text.length > 0) {
      starts.push(abs);
    }
    abs += text.length;
  }
  return starts;
}

function wordIndexAtCaret(starts: number[], caret: number): number {
  let found = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i]! <= caret) {
      found = i;
    } else {
      break;
    }
  }
  return found;
}

function lineJump(text: string, caret: number, direction: -1 | 1): number | null {
  if (direction > 0) {
    const nextBreak = text.indexOf("\n", caret);
    if (nextBreak === -1) {
      return null;
    }
    return nextBreak + 1;
  }
  const lineStart = text.lastIndexOf("\n", Math.max(0, caret - 1));
  if (lineStart === -1) {
    return null;
  }
  return text.lastIndexOf("\n", lineStart - 1) + 1;
}

function previousLineEdge(text: string, starts: number[], lineStart: number): number {
  const prevLineStart = text.lastIndexOf("\n", lineStart - 2) + 1;
  let edge = prevLineStart;
  for (const start of starts) {
    if (start >= lineStart) {
      break;
    }
    if (start >= prevLineStart) {
      edge = start;
    }
  }
  return edge;
}

/** Caret offset after a read-mode arrow. Null means the key should move normally, or there is nowhere to go. */
export function caretAfterReadJump(
  manager: TextManager,
  caret: number,
  contextRadius: number,
  direction: -1 | 1
): number | null {
  const length = readJumpLength(contextRadius);
  if (length === "none") {
    return null;
  }
  if (length === "line") {
    const target = lineJump(manager.realText, caret, direction);
    return target == null || target === caret ? null : target;
  }

  const text = manager.realText;
  const starts = maskableStarts(manager);
  if (starts.length === 0) {
    return null;
  }
  const current = wordIndexAtCaret(starts, caret);

  if (direction > 0) {
    const newline = text.indexOf("\n", caret);
    // Land on the last character of this line first, so the ending stays in view.
    const beforeNewline = newline > 0 ? newline - 1 : -1;
    if (newline !== -1 && caret >= beforeNewline && caret <= newline) {
      for (const start of starts) {
        if (start > newline) {
          return start;
        }
      }
      return null;
    }
    const stopBeforeBreak = beforeNewline > caret;
    let crossed = 0;
    let landing = caret;
    for (let i = current + 1; i < starts.length && crossed < length; i++) {
      if (stopBeforeBreak && starts[i]! > newline) {
        return beforeNewline;
      }
      landing = starts[i]!;
      crossed++;
    }
    if (stopBeforeBreak && crossed < length) {
      return beforeNewline;
    }
    return landing === caret ? null : landing;
  }

  const lineStart = text.lastIndexOf("\n", Math.max(0, caret - 1)) + 1;
  if (caret === lineStart && lineStart > 0) {
    const edge = previousLineEdge(text, starts, lineStart);
    return edge === caret ? null : edge;
  }

  let crossed = 0;
  let landing = caret;
  for (let i = current - 1; i >= 0 && crossed < length; i--) {
    if (starts[i]! < lineStart) {
      return lineStart === caret ? null : lineStart;
    }
    landing = starts[i]!;
    crossed++;
  }
  if (crossed < length && lineStart > 0 && lineStart < caret) {
    return lineStart;
  }
  return landing === caret ? null : landing;
}
