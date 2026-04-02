"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Editor, Node, Range, Transforms } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Editable, RenderLeafProps, Slate, withReact } from "slate-react";
import TextManager from "@/src/buffer/TextManager";
import ReplacementSet from "@/src/mask/ReplacementSet";
import { loadWordSet } from "@/src/mask/WordSets";
import { computeDisplayChunks, type DisplayChunk } from "@/src/view/DisplayComposer";
import { useEditorUi } from "@/components/editor/EditorUiContext";
import { useEditorText } from "@/components/editor/EditorTextContext";

const initialValue: Descendant[] = [
  {
    children: [{ text: "" }],
  },
];

function textToSlateChildren(text: string): Descendant[] {
  const lines = text.split("\n");
  return lines.map((line) => ({
    children: [{ text: line }],
  })) as Descendant[];
}

function caretIndexToSelection(text: string, caretIndex: number): Range {
  const lines = text.split("\n");
  let remaining = Math.max(0, caretIndex);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineLen = lines[lineIndex].length;
    if (remaining <= lineLen) {
      const point = { path: [lineIndex, 0], offset: remaining };
      return { anchor: point, focus: point } as Range;
    }
    remaining -= lineLen + 1; // '\n'
  }

  const lastLineIndex = Math.max(0, lines.length - 1);
  const lastOffset = lines[lastLineIndex]?.length ?? 0;
  const point = { path: [lastLineIndex, 0], offset: lastOffset };
  return { anchor: point, focus: point } as Range;
}

export default function SingleMixedEditor() {
  const { editorSettings, effectiveViewMode, maskStyle } = useEditorUi();
  const { registerTextAccessors, registerCommandAccessors } = useEditorText();
  const { contextRadius, fontStyle, fontSize } = editorSettings;

  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  const ENABLE_REAL_COLOR = true;

  const [cursorActive, setCursorActive] = useState<boolean>(true);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [realTextSnapshot, setRealTextSnapshot] = useState<string>("");
  const [maskedTextSnapshot, setMaskedTextSnapshot] = useState<string>("");
  const [overlayChunks, setOverlayChunks] = useState<DisplayChunk[]>([]);

  const managerRef = useRef<TextManager | null>(null);
  const previousDisplayTextRef = useRef<string>("");
  const latestCaretIndexRef = useRef<number>(0);
  const isProjectingRef = useRef<boolean>(false);
  const prevContextRadiusRef = useRef<number>(contextRadius);
  const projectedTextRef = useRef<string>("");
  const projectedRealRangesRef = useRef<Array<{ start: number; end: number }>>(
    []
  );

  useEffect(() => {
    registerTextAccessors({
      getRealText: () => managerRef.current?.getRealText() ?? "",
      getMaskedText: () => managerRef.current?.getMaskedText() ?? "",
    });

    return () => {
      registerTextAccessors(null);
    };
  }, [registerTextAccessors]);

  useEffect(() => {
    registerCommandAccessors({
      undo: () => {
        HistoryEditor.undo(editor as HistoryEditor);
      },
      redo: () => {
        HistoryEditor.redo(editor as HistoryEditor);
      }
    });

    return () => {
      registerCommandAccessors(null);
    };
  }, [editor, registerCommandAccessors]);

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

  function setProjectionText(projectedChunks: DisplayChunk[]) {
    projectedTextRef.current = projectedChunks.map((c) => c.text).join("");
    projectedRealRangesRef.current = [];
    if (ENABLE_REAL_COLOR) {
      setOverlayChunks(projectedChunks);
    } else {
      setOverlayChunks([]);
    }
  }

  const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    return (
      <span {...attributes} className="text-gray-700 selection:text-gray-700">
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

  function getCaretIndexNow(): number {
    return getCaretIndexFromSelection(editor.children as Descendant[]);
  }

  function applyProjection(
    projectedChunks: DisplayChunk[],
    caretIndex: number
  ) {
    // Update Slate editor text to match mixed projected display.
    // Styling is applied via `decorate`, so we keep Slate's structure minimal.
    isProjectingRef.current = true;

    setProjectionText(projectedChunks);
    const projectedText = projectedTextRef.current;

    const newChildren = textToSlateChildren(projectedText);
    const newSelection = caretIndexToSelection(projectedText, caretIndex);

    editor.withoutNormalizing(() => {
      editor.children = newChildren as any;
      editor.selection = newSelection;
    });

    // Force Slate to notify React.
    editor.onChange();

    // Keep cached caret index in sync for subsequent effects.
    latestCaretIndexRef.current = caretIndex;

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
      effectiveViewMode,
      contextRadius,
      cursorActive
    );
    const projectedText = projectedChunks.map((c) => c.text).join("");

    // Always refresh overlay coloring, even if we don't need to re-project text.
    if (ENABLE_REAL_COLOR) {
      setOverlayChunks(projectedChunks);
    }

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
      effectiveViewMode,
      contextRadius,
      effectiveCursorActive
    );
    const projectedText = projectedChunks.map((c) => c.text).join("");

    if (ENABLE_REAL_COLOR) {
      setOverlayChunks(projectedChunks);
    }

    if (projectedText !== previousDisplayTextRef.current) {
      applyProjection(projectedChunks, getCaretIndexNow());
    }

    prevContextRadiusRef.current = contextRadius;
  }, [effectiveViewMode, contextRadius, cursorActive]);

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
        effectiveViewMode,
        contextRadius,
        cursorActive
      );
      const projectedText = projectedChunks.map((c) => c.text).join("");

      if (ENABLE_REAL_COLOR) {
        setOverlayChunks(projectedChunks);
      }

      if (projectedText !== previousDisplayTextRef.current) {
        applyProjection(projectedChunks, getCaretIndexNow());
      }

      refreshFeatureSnapshots();
    })();

    return () => {
      cancelled = true;
    };
  }, [maskStyle, effectiveViewMode, contextRadius, cursorActive]);

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

          {ENABLE_REAL_COLOR && overlayChunks.length > 0 && (
            <div
              className="pointer-events-none absolute inset-0 p-12 whitespace-pre-wrap leading-relaxed"
              style={{ fontFamily, fontSize }}
            >
              {overlayChunks.map((chunk, idx) => (
                <span
                  key={idx}
                  className={chunk.isReal ? "text-[#783204]" : "text-transparent"}
                >
                  {chunk.text}
                </span>
              ))}
            </div>
          )}
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

