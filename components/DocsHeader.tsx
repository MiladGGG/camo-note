"use client";

type ViewMode = "masked" | "real";
type MaskStyle = "natural" | "scientific" | "business" | "story" | "pirate";
type FontStyle = "verdana" | "arial" | "tahoma" | "times" | "georgia" | "courier";

type DocsHeaderProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  maskStyle: MaskStyle;
  onMaskStyleChange: (style: MaskStyle) => void;
  contextRadius: number;
  onContextRadiusChange: (radius: number) => void;
  fontStyle: FontStyle;
  onFontStyleChange: (style: FontStyle) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
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
  maskStyle,
  onMaskStyleChange,
  contextRadius,
  onContextRadiusChange,
  fontStyle,
  onFontStyleChange,
  fontSize,
  onFontSizeChange,
}: DocsHeaderProps) {
  return (
    <header className="relative z-20 bg-white/95 backdrop-blur flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-4 shadow-sm select-none">
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

            {/* Masking style dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-1 rounded hover:bg-gray-100"
              >
                Masking
              </button>
              <div className="pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 opacity-0 -translate-y-0.5 absolute left-0 mt-0.0 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <ul className="py-1 text-[11px] text-gray-700">
                  {[
                    { label: "Natural", value: "natural" as MaskStyle },
                    { label: "Scientific", value: "scientific" as MaskStyle },
                    { label: "Business", value: "business" as MaskStyle },
                    { label: "Story", value: "story" as MaskStyle },
                    { label: "Pirate", value: "pirate" as MaskStyle },
                  ].map((opt) => (
                    <li
                      key={opt.value}
                      className={`px-3 py-1 hover:bg-gray-50 cursor-pointer flex items-center gap-2 ${
                        maskStyle === opt.value ? "font-semibold" : ""
                      }`}
                      onClick={() => onMaskStyleChange(opt.value)}
                    >
                      {maskStyle === opt.value && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                      )}
                      <span>{opt.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3 mr-1">
          <button
            type="button"
            className="px-3 py-1.5 text-[11px] font-medium rounded-full border border-gray-200 bg-white hover:bg-gray-50"
            onClick={() =>
              onViewModeChange(viewMode === "masked" ? "real" : "masked")
            }
          >
            View: {viewMode === "masked" ? "Masked" : "Real"}
          </button>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>Context</span>
            <div className="inline-flex rounded-full border border-gray-200 bg-white overflow-hidden">
              {[
                { label: 1, radius: 0 },
                { label: 3, radius: 1 },
                { label: 5, radius: 3 },
              ].map(({ label, radius }) => (
                <button
                  key={label}
                  type="button"
                  className={`px-2 py-0.5 ${
                    contextRadius === radius
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => onContextRadiusChange(radius)}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                className={`px-2 py-0.5 ${
                  contextRadius === -1
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => onContextRadiusChange(-1)}
              >
                L
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>Font</span>
            <select
              className="px-2 py-0.5 border border-gray-200 rounded text-[10px] bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={fontStyle}
              onChange={(e) => onFontStyleChange(e.target.value as FontStyle)}
            >
              <option value="verdana">Verdana</option>
              <option value="arial">Arial</option>
              <option value="tahoma">Tahoma</option>
              <option value="times">Times New Roman</option>
              <option value="georgia">Georgia</option>
              <option value="courier">Courier (mono)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>Size</span>
            <select
              className="px-2 py-0.5 border border-gray-200 rounded text-[10px] bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={fontSize}
              onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))}
            >
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
              <option value={14}>14</option>
              <option value={16}>16</option>
              <option value={18}>18</option>
              <option value={20}>20</option>
            </select>
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


