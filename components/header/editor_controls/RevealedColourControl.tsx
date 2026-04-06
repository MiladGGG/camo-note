"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorUi } from "@/components/editor/EditorUiContext";
import { REVEALED_TEXT_COLOR_PRESETS } from "@/components/header/revealedTextColorPresets";
import { controlShellBase } from "./styles";

export function RevealedColourControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const { revealedTextColorHex } = editorSettings;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`${controlShellBase} relative items-center`}>
      <button
        type="button"
        className="flex h-8 items-center gap-2 rounded-lg px-2 text-[11px] font-medium text-gray-700 brightness-100 hover:bg-white hover:shadow-sm hover:brightness-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Revealed text colour"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Colour</span>
        <span
          className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/20"
          style={{ backgroundColor: revealedTextColorHex }}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Choose revealed text colour"
          className="absolute left-0 top-full z-[60] mt-1 min-w-[11.5rem] overflow-hidden rounded-xl border border-gray-200/90 bg-white py-1 shadow-xl shadow-gray-900/10 ring-1 ring-black/5"
        >
          {REVEALED_TEXT_COLOR_PRESETS.map((preset) => {
            const selected = preset.hex === revealedTextColorHex;
            return (
              <li
                key={preset.hex}
                role="option"
                aria-selected={selected}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-[11px] text-gray-800 hover:bg-blue-50/90 ${
                  selected ? "bg-blue-50/70 font-medium" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  updateEditorSettings({ revealedTextColorHex: preset.hex });
                  setOpen(false);
                }}
              >
                <span
                  className="h-5 w-5 shrink-0 rounded-full ring-1 ring-black/15"
                  style={{ backgroundColor: preset.hex }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">{preset.label}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
