"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { controlShellBase, editorControlLabel, sizeSelect } from "./styles";

const SIZE_OPTIONS = [6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 48] as const;

export function SizeSelectControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const { fontSize } = editorSettings;

  return (
    <div className={`${controlShellBase} items-center`}>
      <span className={editorControlLabel}>Size</span>
      <select
        className={sizeSelect}
        value={String(fontSize)}
        onChange={(e) =>
          updateEditorSettings({ fontSize: parseInt(e.target.value, 10) })
        }
      >
        {SIZE_OPTIONS.map((n) => (
          <option key={n} value={String(n)}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
