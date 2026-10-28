"use client";

import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import { useEditorText } from "@/components/editor/EditorTextContext";
import { looksBinary, plainTextFromFile } from "@/src/import/plainTextFromFile";
import toast from "react-hot-toast";

const onFileNew = () => {
  window.open("/editor", "_blank");
};

export function useFileButtons(): HeaderDropdownItem[] {
  const { insertPlainText } = useEditorText();

  const onFileOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.rtf,text/plain,text/rtf,application/rtf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      try {
        const text = await plainTextFromFile(file);
        if (!text) {
          toast("That file is empty", { icon: "ℹ️", position: "top-center" });
          return;
        }
        if (looksBinary(text)) {
          toast.error("Open a .txt or .rtf file", { position: "top-center" });
          return;
        }
        const inserted = insertPlainText(text);
        if (!inserted) {
          toast.error("Editor is not ready yet", { position: "top-center" });
          return;
        }
        toast.success("Pasted file contents", { position: "top-center" });
      } catch {
        toast.error("Could not read that file", { position: "top-center" });
      }
    };
    input.click();
  };

  return [
    { key: "file-new", label: "New", onClick: onFileNew },
    { key: "file-open", label: "Open…", onClick: onFileOpen },
  ];
}
