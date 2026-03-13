"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Node, Range } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import TextManager from "@/src/buffer/TextManager";
import {
  computeDisplayText,
  ViewMode,
} from "@/src/view/DisplayComposer";

type MaskedEditorProps = {
  viewMode: ViewMode;
  contextRadius: number;
};

const initialValue: Descendant[] = [
  {
    children: [{ text: "" }],
  },
];

export default function MaskedEditor({
  viewMode,
  contextRadius,
}: MaskedEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [displayText, setDisplayText] = useState<string>("");
  const managerRef = useRef<TextManager | null>(null);
  const previousTextRef = useRef<string>("");

  function handleChange(newValue: Descendant[]) {
    setValue(newValue);

    const plainText = newValue
      .map((n) => Node.string(n))
      .join("\n");

    if (!managerRef.current) {
      managerRef.current = new TextManager(8);
    }
    const manager = managerRef.current;

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

      previousTextRef.current = plainText;
    }

    if (editor.selection && Range.isCollapsed(editor.selection)) {
      const { anchor } = editor.selection;
      const path = anchor.path;
      const offset = anchor.offset;

      let caretIndex = 0;
      const blockIndex = path[0];
      const inlineIndex = path[1];

      const block = newValue[blockIndex] as any;
      for (let i = 0; i < inlineIndex; i++) {
        caretIndex += Node.string(block.children[i]).length;
      }
      caretIndex += offset;

      manager.setCursor(caretIndex);
    }

    const text = computeDisplayText(manager, viewMode, contextRadius);
    setDisplayText(text);
  }

  useEffect(() => {
    const manager = managerRef.current;
    const text = computeDisplayText(manager, viewMode, contextRadius);
    setDisplayText(text);
  }, [viewMode, contextRadius]);

  return (
    <div className="w-full max-w-4xl my-10 bg-white shadow-sm">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <div
          className="
            relative
            min-h-[400px]
            p-12
            whitespace-pre-wrap
            leading-relaxed
            font-mono
          "
        >
          <Editable
            spellCheck={false}
            autoFocus
            placeholder="Start writing your masked diary..."
            className="focus:outline-none text-transparent caret-black selection:bg-blue-200"
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

      {/** Debug outputs */}
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
          <div className="font-medium mb-1">Debug: Fully masked text</div>
          <div className="whitespace-pre-wrap break-words">
            {managerRef.current?.getMaskedText() || (
              <span className="text-gray-400">No text yet…</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
