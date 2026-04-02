"use client";

import { useEffect } from "react";
import SingleMixedEditor from "@/components/SingleMixedEditor";
import DocsHeader from "@/components/DocsHeader";
import { EditorUiProvider, useEditorUi } from "@/components/editor/EditorUiContext";
import { EditorTextProvider, useEditorText } from "@/components/editor/EditorTextContext";
import { Toaster } from "react-hot-toast";

function HomeContent() {
  const { overrideViewMode, setOverrideViewMode } = useEditorUi();
  const { getRealText } = useEditorText();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasUnsavedChanges = getRealText().trim().length > 0;
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [getRealText]);

  return (
    <div
      className="flex flex-col min-h-screen"
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

      <main className="flex-1 flex justify-center">
        <SingleMixedEditor />
      </main>

      <footer className="shrink-0 border-t border-gray-200 bg-white/95 px-4 sm:px-8 lg:px-12 py-3 text-xs text-gray-600 flex items-center justify-between">
        <span>Camo Note</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/miladggg/camo-note"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-900 underline-offset-2 hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://miladggg.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-900 underline-offset-2 hover:underline"
          >
            My Website
          </a>
        </div>
      </footer>
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
