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
    expect(caretAfterReadJump(textManager, 0, 5, 1)).toBe(lineStart);
    expect(caretAfterReadJump(textManager, lineStart, 5, -1)).toBe("a b c ".length);
    expect(caretAfterReadJump(textManager, "a b c d\ne f ".length, 5, -1)).toBe(lineStart);
  });

  test("line context jumps to the next line", () => {
    textManager.insert("Hello brave\nworld");
    expect(caretAfterReadJump(textManager, 0, CONTEXT_RADIUS_LINE, 1)).toBe("Hello brave\n".length);
  });
});
