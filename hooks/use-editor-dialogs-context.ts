"use client";

import { createContext, useContext } from "react";
import { type useProjectDialogs } from "./use-project-dialogs";

type DialogsContextValue = ReturnType<typeof useProjectDialogs>;

export const EditorDialogsContext = createContext<DialogsContextValue | null>(null);

export function useEditorDialogs() {
  const ctx = useContext(EditorDialogsContext);
  if (!ctx) throw new Error("useEditorDialogs must be used inside EditorShell");
  return ctx;
}
