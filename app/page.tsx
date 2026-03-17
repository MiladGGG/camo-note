"use client";

import { useState } from "react";
import MaskedEditor from "@/components/MaskedEditor";
import DocsHeader from "@/components/DocsHeader";

type ViewMode = "masked" | "real";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("masked");
  const [contextRadius, setContextRadius] = useState<number>(0);
  const [overrideViewMode, setOverrideViewMode] = useState<ViewMode | null>(
    null
  );

  const effectiveViewMode = overrideViewMode ?? viewMode;

  return (
    <div
      className="flex flex-col h-screen"
      onKeyDown={(e) => {
        if (e.key === "`" && overrideViewMode === null) {
          e.preventDefault();
          setOverrideViewMode("real");
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "`" && overrideViewMode !== null) {
          e.preventDefault();
          setOverrideViewMode(null);
        }
      }}
      tabIndex={0}
    >
      <DocsHeader
        viewMode={effectiveViewMode}
        onViewModeChange={setViewMode}
        contextRadius={contextRadius}
        onContextRadiusChange={setContextRadius}
      />

      <main className="flex-1 overflow flex justify-center">
        <MaskedEditor
          viewMode={effectiveViewMode}
          contextRadius={contextRadius}
        />
      </main>
    </div>
  );
}
