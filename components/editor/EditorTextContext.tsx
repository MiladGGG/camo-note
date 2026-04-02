"use client";

import { createContext, ReactNode, useCallback, useContext, useRef } from "react";

type EditorTextAccessors = {
  getRealText: () => string;
  getMaskedText: () => string;
};

type EditorCommandAccessors = {
  undo: () => void;
  redo: () => void;
};

type EditorTextContextValue = {
  registerTextAccessors: (accessors: EditorTextAccessors | null) => void;
  registerCommandAccessors: (accessors: EditorCommandAccessors | null) => void;
  getRealText: () => string;
  getMaskedText: () => string;
  undo: () => void;
  redo: () => void;
};

const EditorTextContext = createContext<EditorTextContextValue | null>(null);

type EditorTextProviderProps = {
  children: ReactNode;
};

export function EditorTextProvider({ children }: EditorTextProviderProps) {
  const accessorsRef = useRef<EditorTextAccessors | null>(null);
  const commandsRef = useRef<EditorCommandAccessors | null>(null);

  const registerTextAccessors = useCallback(
    (accessors: EditorTextAccessors | null) => {
      accessorsRef.current = accessors;
    },
    []
  );

  const registerCommandAccessors = useCallback(
    (accessors: EditorCommandAccessors | null) => {
      commandsRef.current = accessors;
    },
    []
  );

  const getRealText = useCallback(() => {
    return accessorsRef.current?.getRealText() ?? "";
  }, []);

  const getMaskedText = useCallback(() => {
    return accessorsRef.current?.getMaskedText() ?? "";
  }, []);

  const undo = useCallback(() => {
    commandsRef.current?.undo();
  }, []);

  const redo = useCallback(() => {
    commandsRef.current?.redo();
  }, []);
  return (
    <EditorTextContext.Provider
      value={{
        registerTextAccessors,
        registerCommandAccessors,
        getRealText,
        getMaskedText,
        undo,
        redo,
      }}
    >
      {children}
    </EditorTextContext.Provider>
  );
}

export function useEditorText() {
  const ctx = useContext(EditorTextContext);
  if (!ctx) {
    throw new Error("useEditorText must be used within EditorTextProvider");
  }
  return ctx;
}
