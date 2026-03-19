"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Node, Range } from "slate";
import { Editable, RenderLeafProps, Slate, withReact } from "slate-react";
import TextManager from "@/src/buffer/TextManager";
import ReplacementSet from "@/src/mask/ReplacementSet";
import { loadWordSet } from "@/src/mask/WordSets";
import {
  computeDisplayChunks,
  ViewMode,
  type DisplayChunk,
} from "@/src/view/DisplayComposer";

type MaskStyle =
  | "natural"
  | "scientific"
  | "business"
  | "story"
  | "pirate";

type FontStyle =
  | "verdana"
  | "arial"
  | "tahoma"
  | "times"
  | "georgia"
  | "courier";

type SingleMixedEditorProps = {
  viewMode: ViewMode;
  maskStyle: MaskStyle;
  contextRadius: number;
  fontStyle: FontStyle;
  fontSize: number;
};

const initialValue: Descendant[] = [
  {
    children: [{ text: "" }],
  },
];

type StyledLeaf = { text: string; isReal: boolean };
type StyledLine = StyledLeaf[];

function chunksToLines(chunks: DisplayChunk[]): StyledLine[] {
  if (!chunks.length) {
    return [[{ text: "", isReal: false }]];
  }

  const lines: StyledLine[] = [];
  let currentLine: StyledLine = [];

  for (const chunk of chunks) {
    const parts = chunk.text.split("\n");
    for (let i = 0; i < parts.length; i++) {
      currentLine.push({ text: parts[i], isReal: chunk.isReal });

      if (i < parts.length - 1) {
        lines.push(currentLine);
        currentLine = [];
      }
    }
  }

  // Ensure at least one line exists (handles docs ending without a newline too).
  if (lines.length === 0) {
    lines.push(currentLine.length ? currentLine : [{ text: "", isReal: false }]);
  } else {
    lines.push(currentLine.length ? currentLine : [{ text: "", isReal: false }]);
  }

  return lines;
}

function chunksToSlateChildren(chunks: DisplayChunk[]): Descendant[] {
  const lines = chunksToLines(chunks);
  return lines.map((line) => ({
    children: line.map((leaf) => ({ text: leaf.text, isReal: leaf.isReal } as any)),
  })) as Descendant[];
}

function caretIndexToSelectionFromLines(
  lines: StyledLine[],
  caretIndex: number
): Range {
  let remaining = Math.max(0, caretIndex);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLeaves = lines[lineIndex];
    const lineLen = lineLeaves.reduce((acc, l) => acc + l.text.length, 0);

    if (remaining <= lineLen) {
      let leafRemaining = remaining;
      for (let leafIndex = 0; leafIndex < lineLeaves.length; leafIndex++) {
        const leafLen = lineLeaves[leafIndex].text.length;
        if (leafRemaining <= leafLen) {
          const point = { path: [lineIndex, leafIndex], offset: leafRemaining };
          return { anchor: point, focus: point } as Range;
        }
        leafRemaining -= leafLen;
      }

      const lastLeafIndex = Math.max(0, lineLeaves.length - 1);
      const lastOffset = lineLeaves[lastLeafIndex].text.length;
      const point = { path: [lineIndex, lastLeafIndex], offset: lastOffset };
      return { anchor: point, focus: point } as Range;
    }

    // -1 is the '\n' between Slate blocks.
    remaining -= lineLen + 1;
  }

  // Clamp to the end of the document.
  const lastLineIndex = Math.max(0, lines.length - 1);
  const lastLineLeaves = lines[lastLineIndex];
  const lastLeafIndex = Math.max(0, lastLineLeaves.length - 1);
  const lastOffset = lastLineLeaves[lastLeafIndex].text.length;
  const point = { path: [lastLineIndex, lastLeafIndex], offset: lastOffset };
  return { anchor: point, focus: point } as Range;
}

export default function SingleMixedEditor({
  viewMode,
  maskStyle,
  contextRadius,
  fontStyle,
  fontSize,
}: SingleMixedEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);

  const [cursorActive, setCursorActive] = useState<boolean>(true);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [realTextSnapshot, setRealTextSnapshot] = useState<string>("");
  const [maskedTextSnapshot, setMaskedTextSnapshot] = useState<string>("");

  const managerRef = useRef<TextManager | null>(null);
  const previousDisplayTextRef = useRef<string>("");
  const latestCaretIndexRef = useRef<number>(0);
  const isProjectingRef = useRef<boolean>(false);
  const prevContextRadiusRef = useRef<number>(contextRadius);

  const fontFamily =
    fontStyle === "courier"
      ? '"Courier New", Courier, monospace'
      : fontStyle === "times"
        ? '"Times New Roman", Times, serif'
        : fontStyle === "georgia"
          ? "Georgia, serif"
          : fontStyle === "arial"
            ? "Arial, Helvetica, sans-serif"
            : fontStyle === "tahoma"
              ? "Tahoma, Verdana, sans-serif"
              : "Verdana, Geneva, sans-serif";

  function refreshFeatureSnapshots() {
    const manager = managerRef.current;
    if (!manager) {
      setRealTextSnapshot("");
      setMaskedTextSnapshot("");
      return;
    }
    setRealTextSnapshot(manager.getRealText());
    setMaskedTextSnapshot(manager.getMaskedText());
  }

  const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    const isReal = (leaf as any).isReal === true;
    return (
      <span
        {...attributes}
        className={
          isReal ? "text-[#07074f]" : "text-gray-700 selection:text-gray-700"
        }
      >
        {children}
      </span>
    );
  };

  function getCaretIndexFromSelection(newValue: Descendant[]): number {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return latestCaretIndexRef.current;
    }

    const { anchor } = editor.selection;
    const path = anchor.path;
    const offset = anchor.offset;

    let caretIndex = 0;
    const blockIndex = path[0];
    const inlineIndex = path[1];

    // count all previous blocks plus their newline separators
    for (let b = 0; b < blockIndex; b++) {
      const prevBlock = newValue[b];
      caretIndex += Node.string(prevBlock).length;
      caretIndex += 1; // the '\n' between blocks
    }

    const block = newValue[blockIndex] as any;
    for (let i = 0; i < inlineIndex; i++) {
      caretIndex += Node.string(block.children[i]).length;
    }
    caretIndex += offset;
    return caretIndex;
  }

  function applyProjection(
    projectedChunks: DisplayChunk[],
    caretIndex: number
  ) {
    // Update Slate editor text to match mixed projected display.
    // We render "real" segments with custom styling via an `isReal` leaf property.
    isProjectingRef.current = true;

    const lines = chunksToLines(projectedChunks);
    const newChildren = lines.map((line) => ({
      children: line.map((leaf) => ({ text: leaf.text, isReal: leaf.isReal } as any)),
    })) as Descendant[];

    const newSelection = caretIndexToSelectionFromLines(lines, caretIndex);

    editor.withoutNormalizing(() => {
      editor.children = newChildren as any;
      editor.selection = newSelection;
    });

    // Force Slate to notify React.
    editor.onChange();

    previousDisplayTextRef.current = projectedChunks
      .map((c) => c.text)
      .join("");
    isProjectingRef.current = false;
  }

  function syncTextManagerFromDisplay(prevText: string, nextText: string) {
    const manager = managerRef.current;
    if (!manager) return;

    if (prevText === nextText) return;

    const prevLen = prevText.length;
    const nextLen = nextText.length;

    let prefixLen = 0;
    while (
      prefixLen < prevLen &&
      prefixLen < nextLen &&
      prevText[prefixLen] === nextText[prefixLen]
    ) {
      prefixLen++;
    }

    let suffixLen = 0;
    while (
      suffixLen < prevLen - prefixLen &&
      suffixLen < nextLen - prefixLen &&
      prevText[prevLen - 1 - suffixLen] === nextText[nextLen - 1 - suffixLen]
    ) {
      suffixLen++;
    }

    const deleteStart = prefixLen;
    const deleteEndPrev = prevLen - suffixLen;
    const deleteCount = deleteEndPrev - deleteStart;

    if (deleteCount > 0) {
      manager.deleteRange(deleteStart, deleteStart + deleteCount);
    }

    const insertText = nextText.slice(prefixLen, nextLen - suffixLen);
    manager.setCursor(deleteStart);
    if (insertText.length > 0) {
      manager.insert(insertText);
    }
  }

  function handleChange(newValue: Descendant[]) {
    const displayText = newValue.map((n) => Node.string(n)).join("\n");

    // If we're projecting (mask toggles), don't update TextManager.
    if (isProjectingRef.current) {
      previousDisplayTextRef.current = displayText;
      return;
    }

    const manager = managerRef.current;
    if (!manager) {
      previousDisplayTextRef.current = displayText;
      return;
    }

    // Sync real text backend from user edits (positional insert/delete diff).
    const prevDisplayText = previousDisplayTextRef.current;
    syncTextManagerFromDisplay(prevDisplayText, displayText);

    // Sync cursor position into TextManager from current Slate selection.
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const caretIndex = getCaretIndexFromSelection(newValue);
      latestCaretIndexRef.current = caretIndex;
      manager.setCursor(caretIndex);
    }

    refreshFeatureSnapshots();

    // Now project the backend into the editor so masked/real letters match.
    const projectedChunks = computeDisplayChunks(
      manager,
      viewMode,
      contextRadius,
      cursorActive
    );
    const projectedText = projectedChunks.map((c) => c.text).join("");

    if (projectedText !== displayText) {
      applyProjection(projectedChunks, latestCaretIndexRef.current);
    } else {
      previousDisplayTextRef.current = displayText;
    }
  }

  // Re-project when reveal rules change (no user edits).
  useEffect(() => {
    const manager = managerRef.current;
    if (!manager) return;
    if (isProjectingRef.current) return;

    const contextRadiusChanged = contextRadius !== prevContextRadiusRef.current;
    const effectiveCursorActive = cursorActive || contextRadiusChanged;

    const projectedChunks = computeDisplayChunks(
      manager,
      viewMode,
      contextRadius,
      effectiveCursorActive
    );
    const projectedText = projectedChunks.map((c) => c.text).join("");

    if (projectedText !== previousDisplayTextRef.current) {
      applyProjection(projectedChunks, latestCaretIndexRef.current);
    }

    prevContextRadiusRef.current = contextRadius;
  }, [viewMode, contextRadius, cursorActive]);

  // Load/refresh replacement set and update TextManager + projection.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const raw = await loadWordSet(maskStyle);
      if (cancelled) return;

      const replacementSet = new ReplacementSet(raw);

      let manager = managerRef.current;
      if (!manager) {
        manager = new TextManager(replacementSet, 64);
        managerRef.current = manager;

        // If the user already typed before the word set finished loading,
        // seed TextManager's real buffer from whatever is currently in the editor.
        const seedText = previousDisplayTextRef.current;
        if (seedText) {
          manager.insert(seedText);
        }
      } else {
        manager.changeReplacementSet(replacementSet);
      }

      const projectedChunks = computeDisplayChunks(
        manager,
        viewMode,
        contextRadius,
        cursorActive
      );
      const projectedText = projectedChunks.map((c) => c.text).join("");

      if (projectedText !== previousDisplayTextRef.current) {
        applyProjection(projectedChunks, latestCaretIndexRef.current);
      }

      refreshFeatureSnapshots();
    })();

    return () => {
      cancelled = true;
    };
  }, [maskStyle]);

  useEffect(() => {
    if (!showInspector) return;
    refreshFeatureSnapshots();
  }, [showInspector]);

  return (
    <div className="relative z-0 w-full max-w-4xl my-10 bg-white shadow-sm flex flex-col">
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <div
          className="relative flex-1 min-h-[400px] p-12 whitespace-pre-wrap leading-relaxed"
          style={{ fontFamily, fontSize }}
        >
          <Editable
            spellCheck={false}
            autoFocus
            placeholder="Start writing your masked diary..."
            className="focus:outline-none caret-black selection:bg-blue-200"
            renderLeaf={renderLeaf}
            onFocus={() => setCursorActive(true)}
            onBlur={() => setCursorActive(false)}
            onKeyDown={(e) => {
              if (e.key === "`") {
                e.preventDefault();
              }
            }}
          />
        </div>
      </Slate>

      <div className="px-4 py-1 border-t border-gray-100 flex items-center justify-end">
        <button
          type="button"
          aria-label={
            showInspector ? "Hide inspector outputs" : "Show inspector outputs"
          }
          title={showInspector ? "Hide inspector" : "Show inspector"}
          className="inline-flex items-center gap-2 text-[11px] text-gray-600 hover:text-gray-900 px-2 py-1 rounded-full bg-white hover:bg-gray-50"
          onClick={() => setShowInspector((prev) => !prev)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="hidden sm:inline">{showInspector ? "Hide" : "Inspect"}</span>
        </button>
      </div>

      {showInspector && (
        <div className="px-4 pb-3 pt-2 bg-white text-[11px] text-gray-600 space-y-2">
          <div>
            <div className="font-medium mb-1">Real text</div>
            <div className="whitespace-pre-wrap break-words">
              {realTextSnapshot || (
                <span className="text-gray-400">No text yet…</span>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Fully masked text</div>
            <div className="whitespace-pre-wrap break-words">
              {maskedTextSnapshot || (
                <span className="text-gray-400">No text yet…</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

