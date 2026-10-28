"use client";

import { useEditorText } from "@/components/editor/EditorTextContext";
import { useEditorUi } from "@/components/editor/EditorUiContext";
import { safeDownloadBase } from "@/src/export/safeDownloadBase";
import { encryptCamoNote } from "@/src/crypto/openSslEnc";
import toast from "react-hot-toast";
import { askPasscode } from "@/components/header/askPasscode";

export function ExportEncryptedButton() {
  const { getRealText } = useEditorText();
  const { documentTitle } = useEditorUi();

  const onClick = async () => {
    const realText = getRealText();
    if (!realText) {
      toast("No text to download yet", { icon: "ℹ️", position: "top-center" });
      return;
    }

    const passcode = await askPasscode({ confirm: true });
    if (passcode == null) {
      return;
    }

    try {
      const bytes = await encryptCamoNote(realText, passcode);
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeDownloadBase(documentTitle, "camo document")}.camo`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Encrypted file downloaded", { position: "top-center" });
    } catch {
      toast.error("Could not encrypt that note", { position: "top-center" });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap rounded-lg border border-transparent px-2.5 py-0.5 text-xs font-medium text-gray-600 brightness-100 hover:bg-gray-100/90 hover:text-gray-900 hover:brightness-[0.99] dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-zinc-50"
    >
      Export as Encrypted
    </button>
  );
}
