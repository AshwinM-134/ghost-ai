"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { type ProjectRow } from "@/lib/projects";

type DialogState =
  | { type: "none" }
  | { type: "create" }
  | { type: "rename"; project: ProjectRow }
  | { type: "delete"; project: ProjectRow };

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

export function useProjectActions() {
  const router = useRouter();
  const params = useParams();
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [createName, setCreateName] = useState("");
  const [createSuffix, setCreateSuffix] = useState("");
  const [renameName, setRenameName] = useState("");
  const [loading, setLoading] = useState(false);

  const createSlug = toSlug(createName);
  const createRoomId = createSlug ? `${createSlug}-${createSuffix}` : "";

  function openCreate() {
    setCreateName("");
    setCreateSuffix(shortSuffix());
    setDialog({ type: "create" });
  }

  function openRename(project: ProjectRow) {
    setRenameName(project.name);
    setDialog({ type: "rename", project });
  }

  function openDelete(project: ProjectRow) {
    setDialog({ type: "delete", project });
  }

  function close() {
    setDialog({ type: "none" });
  }

  async function submitCreate() {
    if (!createName.trim()) return;
    setLoading(true);
    try {
      const id = createRoomId || `project-${shortSuffix()}`;
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim(), id }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const project = await res.json();
      close();
      router.push(`/editor/${project.id}`);
    } finally {
      setLoading(false);
    }
  }

  async function submitRename() {
    if (dialog.type !== "rename" || !renameName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${dialog.project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      close();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function submitDelete() {
    if (dialog.type !== "delete") return;
    const projectId = dialog.project.id;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      close();
      const activeProjectId = Array.isArray(params?.projectId)
        ? params.projectId[0]
        : params?.projectId;
      if (activeProjectId === projectId) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    dialog,
    createName,
    setCreateName,
    createSlug: createRoomId,
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
