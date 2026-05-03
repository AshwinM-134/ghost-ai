"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type useProjectDialogs } from "@/hooks/use-project-dialogs";

type DialogsProps = ReturnType<typeof useProjectDialogs>;

export function ProjectDialogs(props: DialogsProps) {
  const {
    dialog,
    createName,
    setCreateName,
    createSlug,
    renameName,
    setRenameName,
    loading,
    close,
    submitCreate,
    submitRename,
    submitDelete,
  } = props;

  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dialog.type === "rename") {
      setTimeout(() => renameRef.current?.focus(), 50);
    }
  }, [dialog.type]);

  return (
    <>
      {/* Create Project */}
      <Dialog open={dialog.type === "create"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>Give your project a name to get started.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              placeholder="Project name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitCreate()}
              autoFocus
            />
            {createName.trim() && (
              <p className="text-xs text-copy-muted font-mono">
                slug: <span className="text-copy-secondary">{createSlug}</span>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={close} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={submitCreate} disabled={!createName.trim() || loading}>
              {loading ? "Creating…" : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project */}
      <Dialog open={dialog.type === "rename"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            {dialog.type === "rename" && (
              <DialogDescription>
                Renaming &ldquo;{dialog.project.name}&rdquo;
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="py-2">
            <Input
              ref={renameRef}
              placeholder="New name"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitRename()}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={close} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={submitRename} disabled={!renameName.trim() || loading}>
              {loading ? "Renaming…" : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project */}
      <Dialog open={dialog.type === "delete"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            {dialog.type === "delete" && (
              <DialogDescription>
                Are you sure you want to delete &ldquo;{dialog.project.name}&rdquo;? This action
                cannot be undone.
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={close} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitDelete} disabled={loading}>
              {loading ? "Deleting…" : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
