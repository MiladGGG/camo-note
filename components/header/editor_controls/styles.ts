/** Same vertical size (h-10); width hugs content — no shared min-width. */
export const controlShellBase =
  "flex h-10 w-fit shrink-0 gap-2 rounded-[10px] border border-gray-200/80 bg-gray-50/90 px-2 ring-1 ring-black/[0.03]";

/** Labels aligned with Masked / Colour button text (sentence case, not uppercase). */
export const editorControlLabel =
  "shrink-0 text-left text-[11px] font-medium leading-none text-gray-700";

export const fontSelect =
  "h-8 min-h-8 w-[7.25rem] max-w-[7.5rem] cursor-pointer rounded-lg border border-gray-200/90 bg-white py-0 pl-2 pr-7 text-[11px] font-medium text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

/** Wide enough for two tabular digits + native select arrow (WebKit/Firefox reserve ~2rem on the right). */
export const sizeSelect =
  "box-border h-8 min-h-8 w-[5.75rem] min-w-[5.75rem] cursor-pointer rounded-lg border border-gray-200/90 bg-white py-1 pl-2.5 pr-10 text-left text-[11px] font-medium tabular-nums leading-none text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 [color-scheme:light]";

export const contextBarShell =
  "flex h-10 w-fit min-w-0 shrink-0 items-center gap-2.5 rounded-[10px] border border-gray-200/80 bg-gray-50/90 px-2.5 ring-1 ring-black/[0.03]";
