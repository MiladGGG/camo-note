import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import toast from "react-hot-toast";

const onFileNew = () => {window.open("/", "_blank");};
const onFileOpen = () => {toast("Coming soon...", { icon: "ℹ️", position: "top-center" });};


export const fileButtons: HeaderDropdownItem[] = [
  { key: "file-new", label: "New", onClick: onFileNew },
  { key: "file-open", label: "Open", onClick: onFileOpen },

];
