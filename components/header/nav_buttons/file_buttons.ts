"use client";

import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import { useEditorText } from "@/components/editor/EditorTextContext";
import { askPasscode } from "@/components/header/askPasscode";
import { CamoDecryptError, decryptCamoNote, isCamoFilename } from "@/src/crypto/openSslEnc";
import { looksBinary, plainTextFromFile } from "@/src/import/plainTextFromFile";
import toast from "react-hot-toast";

const onFileNew = () => {
  window.open("/editor", "_blank");
};

async function plainTextFromCamoFile(file: File): Promise<string | null> {
  const passcode = await askPasscode();
  if (passcode == null) {
    return null;
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  return decryptCamoNote(bytes, passcode);
}

export function useFileButtons(): HeaderDropdownItem[] {
  const { insertPlainText } = useEditorText();

  const onFileOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.rtf,.camo,text/plain,text/rtf,application/rtf";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      try {
        const text = isCamoFilename(file.name)
          ? await plainTextFromCamoFile(file)
          : await plainTextFromFile(file);
        if (text == null) {
          return;
        }
        if (!text) {
          toast("That file is empty", { icon: "ℹ️", position: "top-center" });
          return;
        }
        if (looksBinary(text)) {
          toast.error("Open a .txt, .rtf, or .camo file", { position: "top-center" });
          return;
        }
        const inserted = insertPlainText(text);
        if (!inserted) {
          toast.error("Editor is not ready yet", { position: "top-center" });
          return;
        }
        toast.success("Pasted file contents", { position: "bottom-center" });
      } catch (error) {
        const message = error instanceof CamoDecryptError ? error.message : "Could not read that file";
        toast.error(message, { position: "top-center" });
      }
    };
    input.click();
  };

  return [
    { key: "file-new", label: "New", onClick: onFileNew },
    { key: "file-open", label: "Open…", onClick: onFileOpen },
  ];
}
