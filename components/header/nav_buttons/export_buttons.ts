"use client";

import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import { useEditorText } from "../../editor/EditorTextContext";
import { useEditorUi } from "../../editor/EditorUiContext";
import toast from "react-hot-toast";

export function useExportButtons(): HeaderDropdownItem[] {
  const { getRealText } = useEditorText();
  const { documentTitle } = useEditorUi();
  const onCopyToClipboard = async () => {
    const realText = getRealText();
    if (!realText) {
      toast("No text to copy yet", { icon: "ℹ️", position: "top-center" });
      return;
    }
    try {
      await navigator.clipboard.writeText(realText);
      toast.success("Copied real text to clipboard", { position: "top-center" });
    } catch {
      toast.error("Clipboard copy failed", { position: "top-center" });
    }
  };

  const onDownloadAsTxt = () => {
    const realText = getRealText();
    if (!realText) {
      toast("No text to download yet", { icon: "ℹ️", position: "top-center" });
      return;
    }
    const blob = new Blob([realText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    
    a.download = `${documentTitle}.txt` || "camo document.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded", { position: "top-center" });
  };

  return [
    {
      key: "export-copy-to-clipboard",
      label: "Copy to Clipboard",
      onClick: onCopyToClipboard,
    },
    {
      key: "export-download-txt",
      label: "Download as .txt file",
      onClick: onDownloadAsTxt,
    },
  ];
}
