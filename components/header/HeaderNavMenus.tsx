"use client";

import HeaderMenuDropdown from "./HeaderMenuDropdown";
import { getHeaderMenuConfigs } from "@/components/header/nav_buttons";
import { useExportButtons } from "@/components/header/nav_buttons/export_buttons";
import { useMaskingButtons } from "@/components/header/nav_buttons/masking_buttons";
import { useEditButtons } from "@/components/header/nav_buttons/edit_buttons";

export default function HeaderNavMenus() {
  const maskingButtons = useMaskingButtons();
  const exportButtons = useExportButtons();
  const editButtons = useEditButtons();
  const menuConfigs = getHeaderMenuConfigs(
    maskingButtons,
    exportButtons,
    editButtons
  );

  return (
    <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 mt-1">
      {menuConfigs.map((menu) => (
        <HeaderMenuDropdown
          key={menu.label}
          label={menu.label}
          items={menu.items}
        />
      ))}
    </nav>
  );
}
