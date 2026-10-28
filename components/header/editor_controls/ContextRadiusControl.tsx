"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { CONTEXT_RADIUS_LINE, CONTEXT_RADIUS_STEPS } from "@/src/view/contextRadius";
import { contextBarShell, editorControlLabel, segmentButtonIdle, segmentTrack } from "./styles";

const SEGMENTS: { label: string; radius: number; title: string }[] = [
  { label: "0", radius: CONTEXT_RADIUS_STEPS[0], title: "Hide every word until reveal mode" },
  { label: "1", radius: CONTEXT_RADIUS_STEPS[1], title: "Reveal the word you are typing" },
  { label: "3", radius: CONTEXT_RADIUS_STEPS[2], title: "Reveal a few words around the caret" },
  { label: "5", radius: CONTEXT_RADIUS_STEPS[3], title: "Reveal a wider stretch around the caret" },
  { label: "10", radius: CONTEXT_RADIUS_STEPS[4], title: "Reveal a wider stretch around the caret" },
];

export function ContextRadiusControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const { contextRadius } = editorSettings;

  return (
    <div className={contextBarShell}>
      <span className={`${editorControlLabel} whitespace-nowrap`}>Context</span>
      <div className={segmentTrack}>
        {SEGMENTS.map(({ label, radius, title }) => (
          <button
            key={label}
            type="button"
            title={title}
            className={`flex min-w-[1.75rem] items-center justify-center px-2 text-[10px] font-medium brightness-100 hover:brightness-[0.97] ${
              contextRadius === radius ? "bg-blue-600 text-white" : segmentButtonIdle
            }`}
            onClick={() => updateEditorSettings({ contextRadius: radius })}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          title="Reveal the whole line"
          className={`flex min-w-[1.75rem] items-center justify-center px-2 text-[10px] font-medium brightness-100 hover:brightness-[0.97] ${
            contextRadius === CONTEXT_RADIUS_LINE ? "bg-blue-600 text-white" : segmentButtonIdle
          }`}
          onClick={() => updateEditorSettings({ contextRadius: CONTEXT_RADIUS_LINE })}
        >
          P
        </button>
      </div>
    </div>
  );
}
