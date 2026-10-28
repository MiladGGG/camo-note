import { beforeEach, describe, expect, test } from "vitest";
import { buildRtfDocument } from "../src/export/buildRtf";
import { plainTextFromBytes } from "../src/import/plainTextFromFile";
import { rtfToPlainText } from "../src/import/rtfToPlainText";
import ReplacementSet from "../src/mask/ReplacementSet";
import { loadWordSet } from "../src/mask/WordSets";
import TextManager from "../src/buffer/TextManager";
import { CONTEXT_RADIUS_NONE } from "../src/view/contextRadius";
import { computeDisplayChunks } from "../src/view/DisplayComposer";
import { wordIndexesAroundOffset } from "../src/view/mouseReveal";

let textManager: TextManager;

async function createTextManager() {
  const raw = await loadWordSet();
  return new TextManager(new ReplacementSet(raw));
}

function realWordChunks(text: string) {
  return computeDisplayChunks(textManager, "masked", 0, true).filter((chunk) => {
    return chunk.text !== " " && chunk.text !== "\n" && chunk.text !== "";
  });
}

describe("context radius 0", () => {
  beforeEach(async () => {
    textManager = await createTextManager();
  });

  test("hides every word while typing, including the current one", () => {
    textManager.insert("Hello brave world");
    const chunks = computeDisplayChunks(textManager, "masked", CONTEXT_RADIUS_NONE, true);
    const words = chunks.filter((chunk) => chunk.text !== " " && chunk.text !== "\n" && chunk.text !== "");
    expect(words.length).toBeGreaterThan(0);
    expect(words.every((chunk) => chunk.isReal === false)).toBe(true);
  });

  test("still reveals the current word when context is 1", () => {
    textManager.insert("Hello brave world");
    const revealed = realWordChunks("Hello brave world").filter((chunk) => chunk.isReal);
    expect(revealed.map((chunk) => chunk.text)).toEqual(["world"]);
  });

  test("reveal mode shows the real document even at context 0", () => {
    textManager.insert("Hello brave world");
    const chunks = computeDisplayChunks(textManager, "real", CONTEXT_RADIUS_NONE, false);
    expect(chunks.map((chunk) => chunk.text).join("")).toBe("Hello brave world");
    expect(chunks.every((chunk) => chunk.isReal)).toBe(true);
  });
});

describe("pointer reveal", () => {
  beforeEach(async () => {
    textManager = await createTextManager();
  });

  test("reveals only the word under the pointer when radius is 0", () => {
    textManager.insert("Hello brave world");
    const indexes = wordIndexesAroundOffset(textManager, 0, 0);
    const chunks = computeDisplayChunks(
      textManager,
      "masked",
      CONTEXT_RADIUS_NONE,
      true,
      indexes
    );
    const revealed = chunks.filter((chunk) => chunk.isReal && chunk.text !== " ");
    expect(revealed.map((chunk) => chunk.text)).toEqual(["Hello"]);
  });

  test("does not reveal words on another line", () => {
    textManager.insert("Hello brave\nworld");
    const worldOffset = "Hello brave\n".length;
    const indexes = wordIndexesAroundOffset(textManager, worldOffset, 5);
    const chunks = computeDisplayChunks(
      textManager,
      "masked",
      CONTEXT_RADIUS_NONE,
      true,
      indexes
    );
    const revealed = chunks.filter((chunk) => chunk.isReal && chunk.text !== " " && chunk.text !== "\n");
    expect(revealed.map((chunk) => chunk.text)).toEqual(["world"]);
  });
});

describe("rtf import", () => {
  test("drops formatting and keeps paragraphs", () => {
    const rtf =
      "{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fswiss Helvetica;}}" +
      "{\\colortbl;\\red0\\green0\\blue0;}" +
      "\\f0\\fs24 Hello \\'e9 world\\par\nSecond line\\emdash\\par\n}";
    expect(rtfToPlainText(rtf)).toBe("Hello é world\nSecond line—\n");
  });

  test("uses unicode escapes and skips the fallback character", () => {
    const rtf = "{\\rtf1\\ansi cafe\\u233?}";
    expect(rtfToPlainText(rtf)).toBe("cafeé");
  });

  test("round-trips a document this app exports", () => {
    const source = "Line one\nLine two";
    const rtf = buildRtfDocument(source, "inter", 14);
    expect(rtfToPlainText(rtf)).toBe(source);
  });

  test("reads txt bytes as utf-8 and rtf bytes as plain text", () => {
    const txt = new TextEncoder().encode("Plain note");
    expect(plainTextFromBytes(txt, "note.txt")).toBe("Plain note");

    const rtf = buildRtfDocument("From a file", "georgia", 12);
    const bytes = new Uint8Array(rtf.length);
    for (let i = 0; i < rtf.length; i++) {
      bytes[i] = rtf.charCodeAt(i);
    }
    expect(plainTextFromBytes(bytes, "note.rtf")).toBe("From a file");
  });
});
