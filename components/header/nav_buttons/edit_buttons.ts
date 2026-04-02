"use client";

import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import { useEditorText } from "@/components/editor/EditorTextContext";

export function useEditButtons(): HeaderDropdownItem[] {
  const { undo, redo} = useEditorText();

  return [
    { key: "edit-undo", label: "Undo", onClick: undo },
    { key: "edit-redo", label: "Redo", onClick: redo },
  ];
}
