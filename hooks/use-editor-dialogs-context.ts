"use client";

import { createContext, useContext } from "react";
import { type useProjectActions } from "./use-project-actions";

type DialogsContextValue = ReturnType<typeof useProjectActions>;

export const EditorDialogsContext = createContext<DialogsContextValue | null>(null);

export function useEditorDialogs() {
  const ctx = useContext(EditorDialogsContext);
  if (!ctx) throw new Error("useEditorDialogs must be used inside EditorShell");
  return ctx;
}
