# Project Dialogs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/editor` home screen, project CRUD dialogs, and sidebar project item actions using mock data only.

**Architecture:** A single `useProjectDialogs` hook owns all dialog/form/loading state and is passed down through `EditorShell` to both `ProjectSidebar` and the editor home page. The three dialogs (Create, Rename, Delete) live in a single `project-dialogs.tsx` file. Mock project data lives in `lib/mock-projects.ts`.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, shadcn/ui Dialog + Input, Tailwind v4, Lucide React

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/mock-projects.ts` | Static mock project list |
| Create | `hooks/use-project-dialogs.ts` | Dialog state, form state, loading state |
| Create | `components/editor/project-dialogs.tsx` | Create / Rename / Delete dialogs |
| Modify | `app/editor/page.tsx` | Editor home — heading + New Project button |
| Modify | `components/editor/project-sidebar.tsx` | Project list with rename/delete actions + mobile backdrop |
| Modify | `components/editor/editor-shell.tsx` | Wire hook, pass handlers down |

---

### Task 1: Mock project data

**Files:**
- Create: `lib/mock-projects.ts`

- [ ] **Step 1: Create mock data file**

```ts
export interface Project {
  id: string;
  name: string;
  slug: string;
  owned: boolean;
}

export const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Platform Architecture", slug: "platform-architecture", owned: true },
  { id: "2", name: "Data Pipeline Design", slug: "data-pipeline-design", owned: true },
  { id: "3", name: "Shared Workspace", slug: "shared-workspace", owned: false },
];
```

- [ ] **Step 2: Commit**

```bash
git add lib/mock-projects.ts
git commit -m "feat: add mock project data"
```

---

### Task 2: `useProjectDialogs` hook

**Files:**
- Create: `hooks/use-project-dialogs.ts`

- [ ] **Step 1: Create the hook**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add hooks/use-project-dialogs.ts
git commit -m "feat: add useProjectDialogs hook"
```

---

### Task 3: Project dialogs component

**Files:**
- Create: `components/editor/project-dialogs.tsx`

- [ ] **Step 1: Create the dialogs component**

```tsx
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
        <DialogContent className="sm:max-w-md">
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
      <Dialog
        open={dialog.type === "rename"}
        onOpenChange={(o) => !o && close()}
      >
        <DialogContent className="sm:max-w-md">
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
      <Dialog
        open={dialog.type === "delete"}
        onOpenChange={(o) => !o && close()}
      >
        <DialogContent className="sm:max-w-md">
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
```

- [ ] **Step 2: Check Dialog component has needed exports**

Run: `grep -n "DialogDescription\|DialogFooter" components/ui/dialog.tsx`

If `DialogDescription` or `DialogFooter` are missing, add them via: `npx shadcn@latest add dialog` (this re-installs, keeping existing file)

- [ ] **Step 3: Commit**

```bash
git add components/editor/project-dialogs.tsx
git commit -m "feat: add Create/Rename/Delete project dialogs"
```

---

### Task 4: Editor home screen

**Files:**
- Modify: `app/editor/page.tsx`

- [ ] **Step 1: Replace editor page with home screen**

```tsx
"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorDialogs } from "@/hooks/use-editor-dialogs-context";

export default function EditorPage() {
  const { openCreate } = useEditorDialogs();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
      </div>
      <Button onClick={openCreate} className="gap-2">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
```

Note: `useEditorDialogs` is a context hook defined in Task 5. This page needs the context because Next.js pages can't receive props directly from layouts.

- [ ] **Step 2: Commit**

```bash
git add app/editor/page.tsx
git commit -m "feat: add editor home screen"
```

---

### Task 5: Wire hook via context + update EditorShell

**Files:**
- Create: `hooks/use-editor-dialogs-context.ts`
- Modify: `components/editor/editor-shell.tsx`

- [ ] **Step 1: Create context**

```ts
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
```

- [ ] **Step 2: Update EditorShell to provide context and render dialogs**

```tsx
"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectDialogs } from "./project-dialogs";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";
import { EditorDialogsContext } from "@/hooks/use-editor-dialogs-context";

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs();

  return (
    <EditorDialogsContext.Provider value={dialogs}>
      <div className="flex flex-col h-screen bg-base overflow-hidden">
        <EditorNavbar
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenCreate={dialogs.openCreate}
          onRename={dialogs.openRename}
          onDelete={dialogs.openDelete}
        />
        <main className="flex-1 overflow-hidden">{children}</main>
        <ProjectDialogs {...dialogs} />
      </div>
    </EditorDialogsContext.Provider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add hooks/use-editor-dialogs-context.ts components/editor/editor-shell.tsx
git commit -m "feat: wire dialog context into EditorShell"
```

---

### Task 6: Update ProjectSidebar with project items + actions + mobile backdrop

**Files:**
- Modify: `components/editor/project-sidebar.tsx`

- [ ] **Step 1: Rewrite ProjectSidebar**

```tsx
"use client";

import { useState } from "react";
import { X, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MOCK_PROJECTS, type Project } from "@/lib/mock-projects";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreate: () => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function ProjectItem({
  project,
  onRename,
  onDelete,
}: {
  project: Project;
  onRename: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative flex items-center rounded-xl px-3 py-2 hover:bg-elevated transition-colors">
      <span className="flex-1 text-sm text-copy-primary truncate">{project.name}</span>
      {project.owned && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-copy-muted opacity-0 group-hover:opacity-100 hover:text-copy-primary hover:bg-subtle transition-all"
            aria-label="Project actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-7 z-50 w-36 rounded-xl bg-elevated border border-surface-border shadow-lg py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(project);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-copy-secondary hover:text-copy-primary hover:bg-subtle transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  Rename
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(project);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-state-error hover:bg-subtle transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onOpenCreate,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  const myProjects = MOCK_PROJECTS.filter((p) => p.owned);
  const sharedProjects = MOCK_PROJECTS.filter((p) => !p.owned);

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Desktop click-outside close (no scrim) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 hidden md:block"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-30 bg-surface border-r border-surface-border flex flex-col transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-12 border-b border-surface-border shrink-0">
          <span className="text-copy-primary font-medium text-sm">Projects</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-7 w-7 rounded-xl text-copy-muted hover:text-copy-primary hover:bg-elevated transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 p-3">
          <Tabs defaultValue="my-projects" className="flex flex-col flex-1 min-h-0">
            <TabsList className="w-full mb-3">
              <TabsTrigger value="my-projects" className="flex-1">My Projects</TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">Shared</TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 overflow-y-auto">
              {myProjects.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-copy-faint text-sm">
                  No projects yet
                </div>
              ) : (
                <div className="space-y-0.5">
                  {myProjects.map((p) => (
                    <ProjectItem key={p.id} project={p} onRename={onRename} onDelete={onDelete} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 overflow-y-auto">
              {sharedProjects.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-copy-faint text-sm">
                  No shared projects
                </div>
              ) : (
                <div className="space-y-0.5">
                  {sharedProjects.map((p) => (
                    <ProjectItem key={p.id} project={p} onRename={onRename} onDelete={onDelete} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-3 border-t border-surface-border shrink-0">
          <Button className="w-full gap-2" onClick={onOpenCreate}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/editor/project-sidebar.tsx
git commit -m "feat: add project items with rename/delete actions and mobile backdrop"
```

---

### Task 7: Check Dialog component exports and verify build

**Files:**
- Check: `components/ui/dialog.tsx`

- [ ] **Step 1: Verify Dialog exports**

Run: `grep "export" components/ui/dialog.tsx`

Ensure these are exported: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`. If any are missing, add them to the file.

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`

Fix any errors before proceeding.

- [ ] **Step 3: Lint check**

Run: `npx next lint`

Fix any errors before proceeding.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -p
git commit -m "fix: resolve TypeScript and lint issues"
```

---

### Task 8: Update progress tracker

**Files:**
- Modify: `context/progress-tracker.md`

- [ ] **Step 1: Update progress tracker**

Update `context/progress-tracker.md`:
- Move Feature 04 to In Progress
- Under Completed, add a Feature 04 entry documenting: editor home screen, Create/Rename/Delete dialogs, sidebar project items with owned-only actions, mobile backdrop, `useProjectDialogs` hook.

- [ ] **Step 2: Commit**

```bash
git add context/progress-tracker.md
git commit -m "chore: update progress tracker for feature 04"
```
