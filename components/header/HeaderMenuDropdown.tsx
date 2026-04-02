"use client";

export type HeaderDropdownItem = {
  key: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

type HeaderMenuDropdownProps = {
  label: string;
  items: HeaderDropdownItem[];
  widthClassName?: string;
};

export default function HeaderMenuDropdown({
  label,
  items,
  widthClassName = "w-44",
}: HeaderMenuDropdownProps) {
  return (
    <div className="relative group">
      <button type="button" className="px-3 py-1 rounded hover:bg-gray-100">
        {label}
      </button>
      <div
        className={`pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 opacity-0 -translate-y-0.5 absolute left-0 mt-0.0 ${widthClassName} bg-white border border-gray-200 rounded-md shadow-lg z-20`}
      >
        <ul className="py-1 text-[11px] text-gray-700">
          {items.map((item) => {
            return (
              <li
                key={item.key}
                className={`px-3 py-1 hover:bg-gray-50 flex items-center gap-2 cursor-pointer
                ${item.active ? "font-semibold" : ""}`}
                onClick={item.onClick}
              >
                {item.active && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                )}
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
