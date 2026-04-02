import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";

const onFileNew = () => {};
const onFileOpen = () => {};
const onFileMakeCopy = () => {};
const onFileDownload = () => {};

export const fileButtons: HeaderDropdownItem[] = [
  { key: "file-new", label: "New", onClick: onFileNew },
  { key: "file-open", label: "Open", onClick: onFileOpen },
  { key: "file-copy", label: "Make a copy", onClick: onFileMakeCopy },
  { key: "file-download", label: "Download", onClick: onFileDownload },
];
