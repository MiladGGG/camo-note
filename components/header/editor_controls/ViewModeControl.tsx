"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";
import { controlShellBase } from "./styles";
import { ViewModeIcon } from "./ViewModeIcon";

export function ViewModeControl() {
  const { updateEditorSettings, effectiveViewMode } = useEditorUi();
  const isMasked = effectiveViewMode === "masked";

  return (
    <div className={`${controlShellBase} items-stretch py-1`}>
      <button
        type="button"
        title="Shortcut: backtick (`) to reveal real text"
        aria-label={isMasked ? "Switch to real view" : "Switch to masked view"}
        className="flex h-full min-h-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-gray-700 brightness-100 hover:bg-white hover:shadow-sm hover:brightness-[0.99]"
        onClick={() =>
          updateEditorSettings({
            viewMode: isMasked ? "real" : "masked",
          })
        }
      >
        {isMasked ? (
          <ViewModeIcon src="/icons/eye-off.svg" className="opacity-90" />
        ) : (
          <ViewModeIcon src="/icons/eye.svg" className="opacity-90" />
        )}
        {isMasked ? (
          <span className="flex min-w-0 max-w-[6.5rem] items-center gap-1">
            <span className="min-w-0 truncate">Masked</span>
            <kbd
              className="pointer-events-none shrink-0 rounded border border-gray-200/90 bg-white px-1 py-px font-mono text-[9px] font-bold text-gray-1000 shadow-sm"
              aria-label="Backtick: hold for temporary real preview"
              title="Hold ` to preview real text"
            >
            `
            </kbd>
          </span>
        ) : (
          <span className="max-w-[4.5rem] min-w-0 truncate">Real</span>
        )}
      </button>
    </div>
  );
}
