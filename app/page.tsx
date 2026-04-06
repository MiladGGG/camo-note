"use client";

import { useEffect } from "react";
import SingleMixedEditor from "@/components/SingleMixedEditor";
import DocsHeader from "@/components/DocsHeader";
import { EditorUiProvider, useEditorUi } from "@/components/editor/EditorUiContext";
import { EditorTextProvider, useEditorText } from "@/components/editor/EditorTextContext";
import { Toaster } from "react-hot-toast";

const DOCUMENT_TITLE_SUFFIX = " - Camo Note";

function HomeContent() {
  const { overrideViewMode, setOverrideViewMode, documentTitle } = useEditorUi();
  const { getRealText } = useEditorText();

  useEffect(() => {
    const name =
      documentTitle.trim() === "" ? "Untitled document" : documentTitle.trim();
    document.title = `${name}${DOCUMENT_TITLE_SUFFIX}`;
  }, [documentTitle]);

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

      <main className="flex-1 flex justify-center px-5 sm:px-10 lg:px-14 pt-10 pb-16">
        <SingleMixedEditor />
      </main>

      <footer className="shrink-0 border-t border-gray-200/80 bg-[var(--color-surface-muted)] px-4 sm:px-8 lg:px-12 py-3.5 text-xs text-gray-600 flex items-center justify-between">
        <span>Camo Note</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/miladggg/camo-note"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-blue-700 hover:underline"
          >
            <img
              src="/icons/github.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain opacity-80"
              decoding="async"
            />
            GitHub
          </a>
          <a
            href="https://miladggg.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-blue-700 hover:underline"
          >
            <img
              src="/icons/website.svg"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain opacity-80"
              decoding="async"
            />
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
