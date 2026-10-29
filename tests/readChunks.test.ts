import { beforeEach, describe, expect, test } from "vitest";
import TextManager from "../src/buffer/TextManager";
import ReplacementSet from "../src/mask/ReplacementSet";
import { loadWordSet } from "../src/mask/WordSets";
import { CONTEXT_RADIUS_LINE, CONTEXT_RADIUS_NONE } from "../src/view/contextRadius";
import { caretAfterReadJump, readJumpLength } from "../src/view/readChunks";

let textManager: TextManager;

async function createTextManager() {
  const raw = await loadWordSet();
  return new TextManager(new ReplacementSet(raw));
}

describe("read jump", () => {
  beforeEach(async () => {
    textManager = await createTextManager();
  });

  test("radius 5 jumps ten words, the words on both sides", () => {
    textManager.insert("a b c d e f g h i j k l m n o");
    expect(readJumpLength(5)).toBe(10);
    const words = "a b c d e f g h i j k".split(" ");
    let start = 0;
    for (let i = 0; i < 10; i++) {
      start += words[i]!.length + 1;
    }
    expect(caretAfterReadJump(textManager, 0, 5, 1)).toBe(start);
  });

  test("radius 0 jumps a single word", () => {
    textManager.insert("one two three");
    expect(caretAfterReadJump(textManager, 0, 0, 1)).toBe(4);
    expect(caretAfterReadJump(textManager, 4, 0, -1)).toBe(0);
  });

  test("context 0 does not take over the arrow keys", () => {
    textManager.insert("one two");
    expect(caretAfterReadJump(textManager, 0, CONTEXT_RADIUS_NONE, 1)).toBeNull();
  });

  test("a newline stops the jump early", () => {
    textManager.insert("a b c d\ne f g h i j k l m n o");
    const lineStart = "a b c d\n".length;
    const beforeNewline = "a b c d".length - 1;
    expect(caretAfterReadJump(textManager, 0, 5, 1)).toBe(beforeNewline);
    expect(caretAfterReadJump(textManager, beforeNewline, 5, 1)).toBe(lineStart);
    expect(caretAfterReadJump(textManager, lineStart, 5, -1)).toBe("a b c ".length);
    expect(caretAfterReadJump(textManager, "a b c d\ne f ".length, 5, -1)).toBe(lineStart);
  });

  test("continuous right arrows cover every word across lines", () => {
    const raw = "aa bb cc dd\nee ff gg hh ii jj kk ll mm nn oo pp qq rr ss tt";
    textManager.insert(raw);
    const radius = 5;
    const starts: number[] = [];
    let abs = 0;
    for (const part of raw.split(/(\s+)/)) {
      if (part.length === 0) {
        continue;
      }
      if (/^\s+$/.test(part)) {
        abs += part.length;
        continue;
      }
      starts.push(abs);
      abs += part.length;
    }

    const covered = new Set<number>();
    const visit = (caret: number) => {
      const lineStart = raw.lastIndexOf("\n", Math.max(0, caret - 1)) + 1;
      const lineBreak = raw.indexOf("\n", caret);
      const lineEnd = lineBreak === -1 ? raw.length : lineBreak;
      let at = 0;
      for (let i = 0; i < starts.length; i++) {
        if (starts[i]! <= caret) {
          at = i;
        }
      }
      for (let i = 0; i < starts.length; i++) {
        const start = starts[i]!;
        if (start >= lineStart && start < lineEnd && Math.abs(i - at) <= radius) {
          covered.add(i);
        }
      }
    };

    let caret = 0;
    visit(caret);
    for (let step = 0; step < 40; step++) {
      const next = caretAfterReadJump(textManager, caret, radius, 1);
      if (next == null || next === caret) {
        break;
      }
      caret = next;
      visit(caret);
    }
    expect(covered.size).toBe(starts.length);
  });

  test("line context jumps to the next line", () => {
    textManager.insert("Hello brave\nworld");
    expect(caretAfterReadJump(textManager, 0, CONTEXT_RADIUS_LINE, 1)).toBe("Hello brave\n".length);
  });
});
