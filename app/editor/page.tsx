"use client";

import { useEffect } from "react";
import SingleMixedEditor from "@/components/SingleMixedEditor";
import DocsHeader from "@/components/DocsHeader";
import SiteFooter from "@/components/SiteFooter";
import { engagePointerMode } from "@/components/header/editor_controls/MouseRevealControl";
import { EditorUiProvider, useEditorUi } from "@/components/editor/EditorUiContext";
import { stepContextRadius } from "@/src/view/contextRadius";
import { EditorTextProvider, useEditorText } from "@/components/editor/EditorTextContext";
import { Toaster } from "react-hot-toast";

const DOCUMENT_TITLE_SUFFIX = " - Camo Note";

function isTextField(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest("input, textarea, select") != null;
}

function contextRadiusDirection(event: { ctrlKey: boolean; metaKey: boolean; altKey: boolean; shiftKey: boolean; key: string; code: string }): -1 | 1 | null {
  if (!event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
    return null;
  }
  if (event.key === "," || event.code === "Comma") {
    return -1;
  }
  if (event.key === "." || event.code === "Period") {
    return 1;
  }
  return null;
}

function HomeContent() {
  const { overrideViewMode, setOverrideViewMode, documentTitle, isDark, editorSettings, updateEditorSettings } =
    useEditorUi();
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
      className={`flex min-h-screen flex-col ${isDark ? "dark bg-[#141416] text-zinc-100" : ""}`}
      onKeyDownCapture={(e) => {
        const direction = contextRadiusDirection(e);
        if (direction == null || isTextField(e.target)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        updateEditorSettings({
          contextRadius: stepContextRadius(editorSettings.contextRadius, direction),
        });
      }}
      onKeyDown={(e) => {
        if (e.key === "`" && overrideViewMode === null) {
          e.preventDefault();
          setOverrideViewMode("real");
        }
        if (e.key === "Escape" && !e.repeat && !isTextField(e.target)) {
          e.preventDefault();
          const next = !editorSettings.mouseReveal;
          updateEditorSettings({ mouseReveal: next });
          engagePointerMode(next);
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
