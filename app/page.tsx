"use client";

import { useState } from "react";
import MaskedEditor from "@/components/MaskedEditor";
import DocsHeader from "@/components/DocsHeader";

type ViewMode = "masked" | "real";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("masked");
  const [contextRadius, setContextRadius] = useState<number>(0);

  return (
    <div className="flex flex-col h-screen">
      <DocsHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        contextRadius={contextRadius}
        onContextRadiusChange={setContextRadius}
      />

      <main className="flex-1 overflow flex justify-center">
        <MaskedEditor
          viewMode={viewMode}
          contextRadius={contextRadius}
        />
      </main>
    </div>
  );
}
