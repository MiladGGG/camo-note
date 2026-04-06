"use client";

import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import { useEditorText } from "../../editor/EditorTextContext";
import { useEditorUi } from "../../editor/EditorUiContext";
import { buildRtfDocument } from "@/src/export/buildRtf";
import { buildTextPdf } from "@/src/export/buildTextPdf";
import { safeDownloadBase } from "@/src/export/safeDownloadBase";
import toast from "react-hot-toast";

export function useExportButtons(): HeaderDropdownItem[] {
  const { getRealText } = useEditorText();
  const { documentTitle, editorSettings } = useEditorUi();
  const { fontStyle, fontSize } = editorSettings;

  const baseName = () => safeDownloadBase(documentTitle, "camo document");

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
    const blob = new Blob([realText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded", { position: "top-center" });
  };

  const onDownloadAsRtf = () => {
    const realText = getRealText();
    if (!realText) {
      toast("No text to download yet", { icon: "ℹ️", position: "top-center" });
      return;
    }
    const rtf = buildRtfDocument(realText, fontStyle, fontSize);
    const blob = new Blob([rtf], { type: "application/rtf;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName()}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("RTF downloaded", { position: "top-center" });
  };

  const onDownloadAsPdf = async () => {
    const realText = getRealText();
    if (!realText) {
      toast("No text to download yet", { icon: "ℹ️", position: "top-center" });
      return;
    }
    try {
      const bytes = await buildTextPdf(realText, fontStyle, fontSize);
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded", { position: "top-center" });
    } catch {
      toast.error("Could not build PDF", { position: "top-center" });
    }
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
    {
      key: "export-download-rtf",
      label: "Download as .rtf file",
      onClick: onDownloadAsRtf,
    },
    {
      key: "export-download-pdf",
      label: "Download as .pdf file",
      onClick: onDownloadAsPdf,
    },
  ];
}
