"use client";

import { useEffect } from "react";
import SingleMixedEditor from "@/components/SingleMixedEditor";
import DocsHeader from "@/components/DocsHeader";
import SiteFooter from "@/components/SiteFooter";
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

      <SiteFooter />
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
