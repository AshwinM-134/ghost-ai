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
