"use client";

import type { ColorMode } from "@/components/header/types";
import { useEditorUi } from "@/components/editor/EditorUiContext";
import { contextBarShell, editorControlLabel, segmentButtonIdle, segmentTrack } from "./styles";

const MODES: { mode: ColorMode; label: string; title: string }[] = [
  { mode: "auto", label: "Auto", title: "Follow the system light or dark theme" },
  { mode: "dark", label: "Dark", title: "Always use dark mode" },
  { mode: "light", label: "Light", title: "Always use light mode" },
];

export function DarkModeControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const { colorMode } = editorSettings;

  return (
    <div className={contextBarShell}>
      <span className={`${editorControlLabel} whitespace-nowrap`}>Theme</span>
      <div className={segmentTrack} role="group" aria-label="Colour theme">
        {MODES.map(({ mode, label, title }) => (
          <button
            key={mode}
            type="button"
            title={title}
            aria-pressed={colorMode === mode}
            className={`flex items-center justify-center px-2 text-[10px] font-medium brightness-100 hover:brightness-[0.97] ${
              colorMode === mode ? "bg-blue-600 text-white" : segmentButtonIdle
            }`}
            onClick={() => updateEditorSettings({ colorMode: mode })}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
