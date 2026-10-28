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
  /** Night mode. Starts from the system theme when the page opens. */
  isDark: boolean;
  setDarkMode: (enabled: boolean) => void;
};

const EditorUiContext = createContext<EditorUiContextValue | null>(null);

function readSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Night mode is sampled at launch and does not follow later system changes. */
function subscribeLaunchTheme() {
  return () => {};
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
    mouseReveal: false,
  });
  // Read once at launch. An empty subscription means later system changes do not retoggle it.
  const systemDarkOnLaunch = useSyncExternalStore(
    subscribeLaunchTheme,
    readSystemDark,
    () => false
  );
  const [darkOverride, setDarkOverride] = useState<boolean | null>(null);
  const isDark = darkOverride ?? systemDarkOnLaunch;

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
      setDarkMode: setDarkOverride,
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
