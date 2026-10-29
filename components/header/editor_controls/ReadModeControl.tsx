"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { controlShellBase } from "./styles";

export function ReadModeControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const enabled = editorSettings.readMode;

  return (
    <div className={`${controlShellBase} items-stretch py-1`}>
      <button
        type="button"
        title="Shortcut: Escape. Left and right arrows jump across the words the context radius is showing."
        aria-pressed={enabled}
        className={`flex h-full min-h-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium brightness-100 hover:brightness-[0.99] ${
          enabled
            ? "bg-blue-600 text-white hover:bg-blue-600"
            : "text-gray-700 hover:bg-white hover:shadow-sm dark:text-zinc-200 dark:hover:bg-zinc-900"
        }`}
        onClick={() => updateEditorSettings({ readMode: !enabled })}
      >
        <span>Read</span>
        <kbd
          className="pointer-events-none shrink-0 rounded border border-gray-200/90 bg-white px-1 py-px font-mono text-[9px] font-bold text-gray-1000 shadow-sm dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-100"
          aria-label="Escape toggles read mode"
          title="Press Escape to toggle read mode"
        >
          esc
        </kbd>
      </button>
    </div>
  );
}
