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
    <div className="group relative">
      <button
        type="button"
        className="rounded-lg border border-transparent px-2.5 py-0.5 text-xs font-medium text-gray-600 brightness-100 hover:bg-gray-100/90 hover:text-gray-900 hover:brightness-[0.99] group-hover:z-30 group-hover:rounded-b-none group-hover:border-gray-200/90 group-hover:border-b-0 group-hover:bg-white/98"
      >
        {label}
      </button>
      <div
        className={`pointer-events-none absolute left-0 top-full z-20 -mt-px ${widthClassName} rounded-b-xl rounded-t-none border border-gray-200/90 bg-white/98 opacity-0 shadow-xl shadow-gray-900/8 ring-1 ring-black/5 backdrop-blur-sm group-hover:pointer-events-auto group-hover:opacity-100`}
      >
        <ul className="py-1 text-[11px] text-gray-700">
          {items.map((item) => {
            return (
              <li
                key={item.key}
                className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 brightness-100 hover:bg-blue-50/80 hover:text-gray-900 hover:brightness-[0.995] ${
                  item.active ? "font-semibold text-gray-900" : ""
                }`}
                onClick={item.onClick}
              >
                {item.active && (
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
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
