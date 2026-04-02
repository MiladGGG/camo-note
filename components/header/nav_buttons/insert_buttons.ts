import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";

const onInsertImage = () => {};
const onInsertTable = () => {};
const onInsertPageBreak = () => {};

export const insertButtons: HeaderDropdownItem[] = [
  { key: "insert-image", label: "Image", onClick: onInsertImage },
  { key: "insert-table", label: "Table", onClick: onInsertTable },
  { key: "insert-page-break", label: "Page break", onClick: onInsertPageBreak },
];
