"use client";

import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import { fileButtons } from "./file_buttons";
import { insertButtons } from "./insert_buttons";
import { viewButtons } from "./view_buttons";

export type HeaderMenuConfig = {
  label: string;
  items: HeaderDropdownItem[];
};

export function getHeaderMenuConfigs(
  maskingButtons: HeaderDropdownItem[],
  exportButtons: HeaderDropdownItem[],
  editButtons: HeaderDropdownItem[]
): HeaderMenuConfig[] {
  return [
    { label: "File", items: fileButtons },
    { label: "Edit", items: editButtons },
    //{ label: "View", items: viewButtons },
    //{ label: "Insert", items: insertButtons },
    { label: "Masking", items: maskingButtons },
    { label: "Export", items: exportButtons },
  ];
}
