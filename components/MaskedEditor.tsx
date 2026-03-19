"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Node, Range } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import TextManager from "@/src/buffer/TextManager";
import ReplacementSet from "@/src/mask/ReplacementSet";
import { loadWordSet } from "@/src/mask/WordSets";
import {
  computeDisplayText,
  ViewMode,
} from "@/src/view/DisplayComposer";

type MaskedEditorProps = {
  viewMode: ViewMode;
  maskStyle: "natural" | "scientific" | "business" | "story" | "pirate";
  contextRadius: number;
  fontStyle: "mono" | "courier" | "menlo";
  fontSize: number;
};

const initialValue: Descendant[] = [
  {
    children: [{ text: "" }],
  },
];

export default function MaskedEditor({
  viewMode,
  maskStyle,
  contextRadius,
  fontStyle,
  fontSize,
}: MaskedEditorProps) {
  // Test mode: use a regular Roboto-like sans stack instead of monospace.
  // We keep `fontStyle` to avoid breaking the UI, but always render in a normal proportional font.
  const fontFamily =
    'Roboto, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif';

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [displayText, setDisplayText] = useState<string>("");
  const [cursorActive, setCursorActive] = useState<boolean>(true);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const managerRef = useRef<TextManager | null>(null);
  const previousTextRef = useRef<string>("");
  const prevCursorActiveRef = useRef<boolean>(true);

  function updateDisplayFromManager(
    manager: TextManager | null,
    currentViewMode: ViewMode,
    currentContextRadius: number,
    currentCursorActive: boolean
  ) {
    if (!manager) {
      return;
    }
    const text = computeDisplayText(
      manager,
      currentViewMode,
      currentContextRadius,
      currentCursorActive
    );
    setDisplayText(text);
  }

  function handleChange(newValue: Descendant[]) {
    setValue(newValue);

    const plainText = newValue
      .map((n) => Node.string(n))
      .join("\n");

    const manager = managerRef.current;
    if (!manager) {
      return;
    }

    const previousText = previousTextRef.current;

    if (plainText !== previousText) {
      const prevLen = previousText.length;
      const nextLen = plainText.length;

      let prefixLen = 0;
      while (
        prefixLen < prevLen &&
        prefixLen < nextLen &&
        previousText[prefixLen] === plainText[prefixLen]
      ) {
        prefixLen++;
      }

      let suffixLen = 0;
      while (
        suffixLen < prevLen - prefixLen &&
        suffixLen < nextLen - prefixLen &&
        previousText[prevLen - 1 - suffixLen] ===
          plainText[nextLen - 1 - suffixLen]
      ) {
        suffixLen++;
      }

      const deleteStart = prefixLen;
      const deleteEndPrev = prevLen - suffixLen;
      const deleteCount = deleteEndPrev - deleteStart;

      if (deleteCount > 0) {
        manager.deleteRange(deleteStart, deleteStart + deleteCount);
      }

      const insertText = plainText.slice(prefixLen, nextLen - suffixLen);

      manager.setCursor(deleteStart);

      if (insertText.length > 0) {
        manager.insert(insertText);
      }

    }

    if (editor.selection && Range.isCollapsed(editor.selection)) {
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

      manager.setCursor(caretIndex);

      // // Debug logs
      // console.log("Slate caret index:", caretIndex);
      // console.log("TextManager curword:", manager.currentWordIndex);
      // manager.printDebugState();
    }


    previousTextRef.current = plainText;

    updateDisplayFromManager(manager, viewMode, contextRadius, cursorActive);
  }

  // Update display text when cursorActive changes (edge when it turns false)
  useEffect(() => {
    const manager = managerRef.current;

    // Only recompute here on the edge where cursorActive just turned false,
    // to avoid double-updating with the handleChange path.
    if (prevCursorActiveRef.current && !cursorActive) {
      updateDisplayFromManager(manager, viewMode, contextRadius, cursorActive);
    }

    prevCursorActiveRef.current = cursorActive;
  }, [cursorActive]);

  // Recompute when viewMode or contextRadius change
  useEffect(() => {
    const manager = managerRef.current;
    updateDisplayFromManager(manager, viewMode, contextRadius, cursorActive);
  }, [viewMode, contextRadius]);

  // Update display text when maskStyle changes
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
      }
      else {
        manager.changeReplacementSet(replacementSet);
      }

      updateDisplayFromManager(
        manager,
        viewMode,
        contextRadius,
        cursorActive
      );
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maskStyle]);

  return (
    <div className="relative z-0 w-full max-w-4xl my-10 bg-white shadow-sm">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <div
          className="
            relative
            min-h-[400px]
            p-12
            whitespace-pre-wrap
            leading-relaxed
          "
          style={{ fontFamily, fontSize }}
        >
          <Editable
            spellCheck={false}
            autoFocus
            placeholder="Start writing your masked diary..."
            className="focus:outline-none text-transparent caret-black selection:bg-gray-200"
            onFocus={() => setCursorActive(true)}
            onBlur={() => setCursorActive(false)}
            onKeyDown={(e) => {
              if (e.key === "`") {
                e.preventDefault();
              }
            }}
          />

          <div
            className="
              pointer-events-none
              absolute inset-0
              p-12
              whitespace-pre-wrap
              leading-relaxed
              text-gray-900
            "
          >
            {displayText || (
              <span className="text-gray-400">
                Start writing to see masked text…
              </span>
            )}
          </div>
        </div>
      </Slate>

      <div className="px-4 py-2 flex items-center justify-end">
        <button
          type="button"
          aria-label={showDebug ? "Hide debug outputs" : "Show debug outputs"}
          className="inline-flex items-center gap-2 text-[11px] text-gray-700 hover:text-gray-900 px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50"
          onClick={() => setShowDebug((prev) => !prev)}
        >
          <svg
            width="16"
            height="16"
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
          {showDebug ? "Hide debug" : "Show debug"}
        </button>
      </div>

      {showDebug && (
        <div className="border-t px-4 py-3 bg-gray-50 text-xs text-gray-600 space-y-2">
          <div>
            <div className="font-medium mb-1">Debug: Real text</div>
            <div className="whitespace-pre-wrap break-words">
              {managerRef.current?.getRealText() || (
                <span className="text-gray-400">No text yet…</span>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">
              Debug: Fully masked text
            </div>
            <div className="whitespace-pre-wrap break-words">
              {managerRef.current?.getMaskedText() || (
                <span className="text-gray-400">No text yet…</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
