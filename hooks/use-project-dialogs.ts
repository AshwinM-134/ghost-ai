"use client";

import { useState } from "react";
import { type Project } from "@/lib/mock-projects";

type DialogState =
  | { type: "none" }
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project };

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setCreateName("");
    setDialog({ type: "create" });
  }

  function openRename(project: Project) {
    setRenameName(project.name);
    setDialog({ type: "rename", project });
  }

  function openDelete(project: Project) {
    setDialog({ type: "delete", project });
  }

  function close() {
    setDialog({ type: "none" });
  }

  async function submitCreate() {
    if (!createName.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    close();
  }

  async function submitRename() {
    if (!renameName.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    close();
  }

  async function submitDelete() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    close();
  }

  return {
    dialog,
    createName,
    setCreateName,
    createSlug: toSlug(createName),
    renameName,
    setRenameName,
    loading,
    openCreate,
    openRename,
    openDelete,
    close,
    submitCreate,
    submitRename,
    submitDelete,
  };
}
