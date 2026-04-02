"use client";

import SingleMixedEditor from "@/components/SingleMixedEditor";
import DocsHeader from "@/components/DocsHeader";
import { EditorUiProvider, useEditorUi } from "@/components/editor/EditorUiContext";
import { EditorTextProvider } from "@/components/editor/EditorTextContext";
import { Toaster } from "react-hot-toast";

function HomeContent() {
  const { overrideViewMode, setOverrideViewMode } = useEditorUi();

  return (
    <div
      className="flex flex-col h-screen"
      onKeyDown={(e) => {
        if (e.key === "`" && overrideViewMode === null) {
          e.preventDefault();
          setOverrideViewMode("real");
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "`" && overrideViewMode !== null) {
          e.preventDefault();
          setOverrideViewMode(null);
        }
      }}
      tabIndex={0}
    >
      <DocsHeader />

      <main className="flex-1 overflow flex justify-center">
        <SingleMixedEditor />
      </main>
      <Toaster/>
    </div>
  );
}

export default function Home() {
  return (
    <EditorUiProvider>
      <EditorTextProvider>
        <HomeContent />
      </EditorTextProvider>
    </EditorUiProvider>
  );
}
