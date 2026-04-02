"use client";

import type { FontStyle } from "./types";
import { useEditorUi } from "@/components/editor/EditorUiContext";

export default function HeaderEditorControls() {
  const { editorSettings, updateEditorSettings, effectiveViewMode } = useEditorUi();
  const { contextRadius, fontStyle, fontSize } = editorSettings;

  return (
    <div className="hidden sm:flex items-center gap-3 mr-1">
      <button
        type="button"
        className="px-3 py-1.5 text-[11px] font-medium rounded-full border border-gray-200 bg-white hover:bg-gray-50"
        onClick={() =>
          updateEditorSettings({
            viewMode: effectiveViewMode === "masked" ? "real" : "masked",
          })
        }
      >
        View: {effectiveViewMode === "masked" ? "Masked" : "Real"}
      </button>

      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <span>Context</span>
        <div className="inline-flex rounded-full border border-gray-200 bg-white overflow-hidden">
          {[
            { label: 1, radius: 0 },
            { label: 3, radius: 2 },
            { label: 5, radius: 5 },
          ].map(({ label, radius }) => (
            <button
              key={label}
              type="button"
              className={`px-2 py-0.5 ${
                contextRadius === radius
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => updateEditorSettings({ contextRadius: radius })}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`px-2 py-0.5 ${
              contextRadius === -1
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => updateEditorSettings({ contextRadius: -1 })}
          >
            L
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <span>Font</span>
        <select
          className="px-2 py-0.5 border border-gray-200 rounded text-[10px] bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={fontStyle}
          onChange={(e) =>
            updateEditorSettings({ fontStyle: e.target.value as FontStyle })
          }
        >
          <optgroup label="Sans Serif">
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

      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <span>Size</span>
        <select
          className="px-2 py-0.5 border border-gray-200 rounded text-[10px] bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={fontSize}
          onChange={(e) =>
            updateEditorSettings({ fontSize: parseInt(e.target.value, 10) })
          }
        >
          <option value={6}>6</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={12}>12</option>
          <option value={14}>14</option>
          <option value={16}>16</option>
          <option value={18}>18</option>
          <option value={20}>20</option>
          <option value={24}>24</option>
          <option value={30}>30</option>
          <option value={48}>48</option>
        </select>
      </div>
    </div>
  );
}
