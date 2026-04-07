import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";
import toast from "react-hot-toast";

const onFileNew = () => {window.open("/editor", "_blank");};
const onFileOpen = () => {toast("Coming soon...", { icon: "ℹ️", position: "top-center" });};


export const fileButtons: HeaderDropdownItem[] = [
  { key: "file-new", label: "New", onClick: onFileNew },
 

];
