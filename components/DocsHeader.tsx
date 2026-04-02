"use client";

import HeaderEditorControls from "@/components/header/HeaderEditorControls";
import HeaderNavMenus from "@/components/header/HeaderNavMenus";
import HeaderTitleInput from "@/components/header/HeaderTitleInput";

export default function DocsHeader() {
  return (
    <header className="relative z-20 bg-white/95 backdrop-blur flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-4 shadow-sm select-none">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          C
        </div>
        <div className="flex flex-col">
          <HeaderTitleInput />
          <HeaderNavMenus />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <HeaderEditorControls />
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


