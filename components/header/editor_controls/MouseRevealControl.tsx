"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { controlShellBase } from "./styles";

/**
 * Toolbar toggle for hover-to-reveal.
 * Safe to delete together with `src/view/mouseReveal.ts` if this needs to come out.
 */
export function MouseRevealControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const enabled = editorSettings.mouseReveal;

  return (
    <div className={`${controlShellBase} items-stretch py-1`}>
      <button
        type="button"
        title="Reveal the words around the pointer, without clicking"
        aria-pressed={enabled}
        className={`flex h-full min-h-0 items-center justify-center rounded-lg px-2.5 text-[11px] font-medium brightness-100 hover:brightness-[0.99] ${
          enabled
            ? "bg-blue-600 text-white hover:bg-blue-600"
            : "text-gray-700 hover:bg-white hover:shadow-sm dark:text-zinc-200 dark:hover:bg-zinc-900"
        }`}
        onClick={() => updateEditorSettings({ mouseReveal: !enabled })}
      >
        Pointer
      </button>
    </div>
  );
}
