"use client";

import { useMemo, useRef, useState } from "react";
import { createEditor, Descendant, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import TextManager from "@/src/buffer/TextManager";

const initialValue: Descendant[] = [
  {
    children: [{ text: "" }],
  },
];

export default function MaskedEditor() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [maskedText, setMaskedText] = useState<string>("");
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

    setMaskedText(manager.getMaskedText());
  }

  return (
    <div className="w-full max-w-4xl my-10 bg-white shadow-sm">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <div
          className="
            min-h-[400px]
            p-12
            outline-none
            whitespace-pre-wrap
            leading-relaxed
          "
        >
          <Editable
            spellCheck={false}
            autoFocus
            placeholder="Start writing your masked diary..."
            className="focus:outline-none"
          />
        </div>
      </Slate>

      <div className="border-t px-4 py-3 bg-gray-50 text-sm text-gray-600">
        <div className="font-medium mb-1">Masked view</div>
        <div className="whitespace-pre-wrap break-words">
          {maskedText || (
            <span className="text-gray-400">
              Start typing to see masked output…
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
