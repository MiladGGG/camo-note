"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { controlShellBase } from "./styles";

/**
 * Toolbar toggle for hover-to-reveal.
 * Safe to delete together with `src/view/mouseReveal.ts` if this needs to come out.
 */
export function engagePointerMode(enabled: boolean) {
  const sheet = document.getElementById("camo-sheet");
  if (enabled) {
    void Promise.resolve(sheet?.requestPointerLock()).catch(() => {});
  } else if (document.pointerLockElement) {
    document.exitPointerLock();
  }
}

export function MouseRevealControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const enabled = editorSettings.mouseReveal;

  return (
    <div className={`${controlShellBase} items-stretch py-1`}>
      <button
        type="button"
        title="Shortcut: Escape. Moving off the left or right edge continues on the next line."
        aria-pressed={enabled}
        className={`flex h-full min-h-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium brightness-100 hover:brightness-[0.99] ${
          enabled
            ? "bg-blue-600 text-white hover:bg-blue-600"
            : "text-gray-700 hover:bg-white hover:shadow-sm dark:text-zinc-200 dark:hover:bg-zinc-900"
        }`}
        onClick={() => {
          const next = !enabled;
          updateEditorSettings({ mouseReveal: next });
          engagePointerMode(next);
        }}
      >
        <span>Pointer</span>
        <kbd
          className="pointer-events-none shrink-0 rounded border border-gray-200/90 bg-white px-1 py-px font-mono text-[9px] font-bold text-gray-1000 shadow-sm dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-100"
          aria-label="Escape toggles pointer mode"
          title="Press Escape to toggle pointer mode"
        >
          esc
        </kbd>
      </button>
    </div>
  );
}
