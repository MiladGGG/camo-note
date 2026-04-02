import type { HeaderDropdownItem } from "@/components/header/HeaderMenuDropdown";

const onViewMode = () => {};
const onViewRuler = () => {};
const onViewFullScreen = () => {};

export const viewButtons: HeaderDropdownItem[] = [
  { key: "view-mode", label: "Mode", onClick: onViewMode },
  { key: "view-ruler", label: "Show ruler", onClick: onViewRuler },
  { key: "view-fullscreen", label: "Full screen", onClick: onViewFullScreen },
];
