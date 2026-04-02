"use client";

import { useEditorUi } from "@/components/editor/EditorUiContext";

export default function HeaderTitleInput() {
  const { documentTitle, setDocumentTitle } = useEditorUi();

  return (
    <div className="flex items-center gap-2">
      <input
        aria-label="Document title"
        value={documentTitle}
        onChange={(e) => setDocumentTitle(e.target.value)}
        className="text-base sm:text-lg font-semibold bg-transparent px-1.5 py-0.5 rounded border border-transparent hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 focus:outline-none min-w-[200px] sm:min-w-[280px]"
      />
    </div>
  );
}
