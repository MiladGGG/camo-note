"use client";

import HeaderEditorControls from "@/components/header/HeaderEditorControls";
import HeaderNavMenus from "@/components/header/HeaderNavMenus";
import HeaderTitleInput from "@/components/header/HeaderTitleInput";

export default function DocsHeader() {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-gray-200/80 bg-white/75 px-4 py-3.5 backdrop-blur-md select-none sm:px-8 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-12">
      <div className="flex w-full min-w-0 items-center gap-3 lg:flex-1 lg:justify-start">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-1">
          <a
            href=""
            target="_blank"
            rel="noreferrer"
            className="-m-1 inline-flex shrink-0 items-center justify-center rounded-full p-1 outline-none transition-colors hover:bg-gray-100/90 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            aria-label="Website home"
          >
            <img
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 object-contain sm:h-13 sm:w-13"
              decoding="async"
            />
          </a>
          <div className="flex min-w-0 flex-col gap-0">
            <HeaderTitleInput />
            <HeaderNavMenus />
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:w-auto lg:shrink-0 lg:justify-end">
        <HeaderEditorControls />
      </div>
    </header>
  );
}
