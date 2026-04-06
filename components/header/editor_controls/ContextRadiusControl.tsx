"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { contextBarShell, editorControlLabel } from "./styles";

const SEGMENTS: { label: number; radius: number }[] = [
  { label: 1, radius: 0 },
  { label: 3, radius: 2 },
  { label: 5, radius: 5 },
];

export function ContextRadiusControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const { contextRadius } = editorSettings;

  return (
    <div className={contextBarShell}>
      <span className={`${editorControlLabel} whitespace-nowrap`}>Context</span>
      <div className="inline-flex h-8 overflow-hidden rounded-lg border border-gray-200/90 bg-white/90">
        {SEGMENTS.map(({ label, radius }) => (
          <button
            key={label}
            type="button"
            className={`flex min-w-[1.75rem] items-center justify-center px-2 text-[10px] font-medium brightness-100 hover:brightness-[0.97] ${
              contextRadius === radius
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => updateEditorSettings({ contextRadius: radius })}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className={`flex min-w-[1.75rem] items-center justify-center px-2 text-[10px] font-medium brightness-100 hover:brightness-[0.97] ${
            contextRadius === -1 ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => updateEditorSettings({ contextRadius: -1 })}
        >
          P
        </button>
      </div>
    </div>
  );
}
