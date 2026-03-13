"use client";

type ViewMode = "masked" | "real";

type DocsHeaderProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  contextRadius: number;
  onContextRadiusChange: (radius: number) => void;
};

const menuItems = [
  { label: "File", options: ["New", "Open", "Make a copy", "Download"] },
  { label: "Edit", options: ["Undo", "Redo", "Cut", "Copy", "Paste"] },
  { label: "View", options: ["Mode", "Show ruler", "Full screen"] },
  { label: "Insert", options: ["Image", "Table", "Page break"] },
  { label: "Format", options: ["Text", "Paragraph styles"] },
];

export default function DocsHeader({
  viewMode,
  onViewModeChange,
  contextRadius,
  onContextRadiusChange,
}: DocsHeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-4 shadow-sm select-none">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          C
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-semibold">
              Untitled document
            </span>
            <span className="text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-full bg-gray-50">
              Private
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 mt-1">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  type="button"
                  className="px-3 py-1 rounded hover:bg-gray-100"
                >
                  {item.label}
                </button>
                <div className="pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 opacity-0 -translate-y-0.5 absolute left-0 mt-0.0 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <ul className="py-1 text-[11px] text-gray-700">
                    {item.options.map((opt) => (
                      <li
                        key={opt}
                        className="px-3 py-1 hover:bg-gray-50 cursor-default"
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 mr-1">
          <button
            type="button"
            className="px-3 py-1.5 text-[11px] font-medium rounded-full border border-gray-200 bg-white hover:bg-gray-50"
            onClick={() =>
              onViewModeChange(viewMode === "masked" ? "real" : "masked")
            }
          >
            View: {viewMode === "masked" ? "Masked" : "Real"}
          </button>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <span>Context</span>
            <div className="inline-flex rounded-full border border-gray-200 bg-white overflow-hidden">
              {[0, 1, 3].map((radius) => (
                <button
                  key={radius}
                  type="button"
                  className={`px-2 py-0.5 ${
                    contextRadius === radius
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => onContextRadiusChange(radius)}
                >
                  {radius}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Share
        </button>
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
          M
        </div>
      </div>
    </header>
  );
}


