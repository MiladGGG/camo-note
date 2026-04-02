 "use client";

import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import { useEditorUi } from "@/components/editor/EditorUiContext";
import type { MaskStyle } from "@/components/header/types";
import toast from "react-hot-toast";

type MaskOption = { label: string; value: MaskStyle };

const maskOptions: MaskOption[] = [
  { label: "Natural", value: "natural" },
  { label: "Scientific", value: "scientific" },
  { label: "Business", value: "business" },
  { label: "Story", value: "story" },
  { label: "Pirate", value: "pirate" },
];

export function useMaskingButtons(): HeaderDropdownItem[] {
  const { maskStyle, setMaskStyle } = useEditorUi();

  return maskOptions.map((opt) => ({
    key: `masking-${opt.value}`,
    label: opt.label,
    active: maskStyle === opt.value,
    onClick: () =>{
      setMaskStyle(opt.value)
      toast(`Mask style changed to ${opt.label}`, {
        icon: '🕶️',
        position: "top-center",
      });
    },
  }));
}
