"use client";

import type { FontStyle } from "@/components/header/types";
import { useEditorUi } from "@/components/editor/EditorUiContext";
import { controlShellBase, editorControlLabel, fontSelect } from "./styles";

export function FontSelectControl() {
  const { editorSettings, updateEditorSettings } = useEditorUi();
  const { fontStyle } = editorSettings;

  return (
    <div className={`${controlShellBase} items-center`}>
      <span className={editorControlLabel}>Font</span>
      <select
        className={fontSelect}
        value={fontStyle}
        onChange={(e) =>
          updateEditorSettings({ fontStyle: e.target.value as FontStyle })
        }
      >
        <optgroup label="Sans Serif">
          <option value="inter">Inter</option>
          <option value="arial">Arial</option>
          <option value="helvetica">Helvetica</option>
          <option value="calibri">Calibri</option>
          <option value="verdana">Verdana</option>
          <option value="tahoma">Tahoma</option>
        </optgroup>
        <optgroup label="Serif">
          <option value="times">Times New Roman</option>
          <option value="georgia">Georgia</option>
        </optgroup>
        <optgroup label="Mono">
          <option value="robotoMono">Roboto Mono</option>
        </optgroup>
      </select>
    </div>
  );
}
