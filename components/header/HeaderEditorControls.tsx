"use client";

import { ContextRadiusControl } from "./editor_controls/ContextRadiusControl";
import { DarkModeControl } from "./editor_controls/DarkModeControl";
import { FontSelectControl } from "./editor_controls/FontSelectControl";
import { ReadModeControl } from "./editor_controls/ReadModeControl";
import { RevealedColourControl } from "./editor_controls/RevealedColourControl";
import { SizeSelectControl } from "./editor_controls/SizeSelectControl";
import { ViewModeControl } from "./editor_controls/ViewModeControl";

export default function HeaderEditorControls() {
  return (
    <div className="mr-1 hidden max-w-full flex-wrap items-center justify-end gap-2 sm:flex">
      <ViewModeControl />
      <ReadModeControl />
      <RevealedColourControl />
      <ContextRadiusControl />
      <FontSelectControl />
      <SizeSelectControl />
      <div className="ml-4">
        <DarkModeControl />
      </div>
    </div>
  );
}
