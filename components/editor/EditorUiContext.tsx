"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
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
  /** Resolved appearance, including Auto following the system theme. */
  isDark: boolean;
};

const EditorUiContext = createContext<EditorUiContextValue | null>(null);

function subscribeSystemDark(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function readSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

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
    colorMode: "auto",
    mouseReveal: false,
  });
  const systemDark = useSyncExternalStore(subscribeSystemDark, readSystemDark, () => false);
  const isDark =
    editorSettings.colorMode === "dark" ||
    (editorSettings.colorMode === "auto" && systemDark);

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
      isDark,
    }),
    [
      documentTitle,
      maskStyle,
      editorSettings,
      overrideViewMode,
      effectiveViewMode,
      isDark,
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
