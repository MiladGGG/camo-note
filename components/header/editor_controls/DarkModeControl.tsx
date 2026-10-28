"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { controlShellBase } from "./styles";

export function DarkModeControl() {
  const { isDark, setDarkMode } = useEditorUi();

  return (
    <div className={`${controlShellBase} items-stretch py-1`}>
      <button
        type="button"
        title="Night mode"
        aria-pressed={isDark}
        className={`flex h-full min-h-0 items-center justify-center rounded-lg px-2.5 text-[11px] font-medium brightness-100 hover:brightness-[0.99] ${
          isDark
            ? "bg-blue-600 text-white hover:bg-blue-600"
            : "text-gray-700 hover:bg-white hover:shadow-sm dark:text-zinc-200 dark:hover:bg-zinc-900"
        }`}
        onClick={() => setDarkMode(!isDark)}
      >
        Night
      </button>
    </div>
  );
}
