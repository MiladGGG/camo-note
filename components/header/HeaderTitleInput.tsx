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
        className="min-w-[200px] sm:min-w-[300px] rounded-lg border border-transparent bg-transparent px-2 py-0 text-lg font-semibold tracking-tight text-gray-900 placeholder:text-gray-400 hover:border-gray-200/90 focus:border-blue-400/80 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-xl"
      />
    </div>
  );
}
