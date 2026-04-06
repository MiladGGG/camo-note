"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  EditorSettings,
  FontStyle,
  MaskStyle,
  ViewMode,
} from "@/components/header/types";
import { DEFAULT_REVEALED_TEXT_COLOR_HEX } from "@/components/header/revealedTextColorPresets";

type EditorUiContextValue = {
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  maskStyle: MaskStyle;
  setMaskStyle: (style: MaskStyle) => void;
  editorSettings: EditorSettings;
  updateEditorSettings: (patch: Partial<EditorSettings>) => void;
  setOverrideViewMode: (mode: ViewMode | null) => void;
  overrideViewMode: ViewMode | null;
  effectiveViewMode: ViewMode;
};

const EditorUiContext = createContext<EditorUiContextValue | null>(null);

type EditorUiProviderProps = {
  children: ReactNode;
};

export function EditorUiProvider({ children }: EditorUiProviderProps) {
  const [documentTitle, setDocumentTitle] = useState<string>("Untitled document");
  const [maskStyle, setMaskStyle] = useState<MaskStyle>("scientific");
  const [overrideViewMode, setOverrideViewMode] = useState<ViewMode | null>(null);
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    viewMode: "masked",
    contextRadius: 0,
    fontStyle: "inter" as FontStyle,
    fontSize: 14,
    revealedTextColorHex: DEFAULT_REVEALED_TEXT_COLOR_HEX,
  });

  const updateEditorSettings = (patch: Partial<EditorSettings>) => {
    setEditorSettings((prev) => ({ ...prev, ...patch }));
  };

  const effectiveViewMode = overrideViewMode ?? editorSettings.viewMode;

  const value = useMemo<EditorUiContextValue>(
    () => ({
      documentTitle,
      setDocumentTitle,
      maskStyle,
      setMaskStyle,
      editorSettings,
      updateEditorSettings,
      setOverrideViewMode,
      overrideViewMode,
      effectiveViewMode,
    }),
    [
      documentTitle,
      maskStyle,
      editorSettings,
      overrideViewMode,
      effectiveViewMode,
    ]
  );

  return (
    <EditorUiContext.Provider value={value}>{children}</EditorUiContext.Provider>
  );
}

export function useEditorUi() {
  const ctx = useContext(EditorUiContext);
  if (!ctx) {
    throw new Error("useEditorUi must be used within EditorUiProvider");
  }
  return ctx;
}
