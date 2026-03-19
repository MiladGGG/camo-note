"use client";

import { useState } from "react";
import MaskedEditor from "@/components/MaskedEditor";
import DocsHeader from "@/components/DocsHeader";

type ViewMode = "masked" | "real";
type MaskStyle = "natural" | "scientific" | "business" | "story" | "pirate";
type FontStyle = "mono" | "courier" | "menlo";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("masked");
  const [contextRadius, setContextRadius] = useState<number>(0);
  const [maskStyle, setMaskStyle] = useState<MaskStyle>("natural");
  const [overrideViewMode, setOverrideViewMode] = useState<ViewMode | null>(
    null
  );
  const [fontStyle, setFontStyle] = useState<FontStyle>("mono");
  const [fontSize, setFontSize] = useState<number>(14);

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
        maskStyle={maskStyle}
        onMaskStyleChange={setMaskStyle}
        contextRadius={contextRadius}
        onContextRadiusChange={setContextRadius}
        fontStyle={fontStyle}
        onFontStyleChange={setFontStyle}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      <main className="flex-1 overflow flex justify-center">
        <MaskedEditor
          viewMode={effectiveViewMode}
          maskStyle={maskStyle}
          contextRadius={contextRadius}
          fontStyle={fontStyle}
          fontSize={fontSize}
        />
      </main>
    </div>
  );
}
