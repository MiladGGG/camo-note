"use client";

import { ContextRadiusControl } from "./editor_controls/ContextRadiusControl";
import { DarkModeControl } from "./editor_controls/DarkModeControl";
import { FontSelectControl } from "./editor_controls/FontSelectControl";
import { MouseRevealControl } from "./editor_controls/MouseRevealControl";
import { RevealedColourControl } from "./editor_controls/RevealedColourControl";
import { SizeSelectControl } from "./editor_controls/SizeSelectControl";
import { ViewModeControl } from "./editor_controls/ViewModeControl";

export default function HeaderEditorControls() {
  return (
    <div className="mr-1 hidden max-w-full flex-wrap items-center justify-end gap-2 sm:flex">
      <ViewModeControl />
      <MouseRevealControl />
      <DarkModeControl />
      <RevealedColourControl />
      <ContextRadiusControl />
      <FontSelectControl />
      <SizeSelectControl />
    </div>
  );
}
