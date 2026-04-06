"use client";

import { ContextRadiusControl } from "./editor_controls/ContextRadiusControl";
import { FontSelectControl } from "./editor_controls/FontSelectControl";
import { RevealedColourControl } from "./editor_controls/RevealedColourControl";
import { SizeSelectControl } from "./editor_controls/SizeSelectControl";
import { ViewModeControl } from "./editor_controls/ViewModeControl";

export default function HeaderEditorControls() {
  return (
    <div className="mr-1 hidden items-center gap-2 sm:flex">
      <ViewModeControl />
      <RevealedColourControl />
      <ContextRadiusControl />
      <FontSelectControl />
      <SizeSelectControl />      
    </div>
  );
}
