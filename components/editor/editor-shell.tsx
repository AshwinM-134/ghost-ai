"use client";

import { useState } from "react";
import { EditorNavbar } from "./editor-navbar";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectDialogs } from "./project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import { EditorDialogsContext } from "@/hooks/use-editor-dialogs-context";
import { type ProjectRow } from "@/lib/projects";

interface EditorShellProps {
  children: React.ReactNode;
  ownedProjects: ProjectRow[];
  sharedProjects: ProjectRow[];
}

export function EditorShell({ children, ownedProjects, sharedProjects }: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const actions = useProjectActions();

  return (
    <EditorDialogsContext.Provider value={actions}>
      <div className="flex flex-col h-screen bg-base overflow-hidden">
        <EditorNavbar
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenCreate={actions.openCreate}
          onRename={actions.openRename}
          onDelete={actions.openDelete}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
        />
        <main className="flex-1 overflow-hidden">{children}</main>
        <ProjectDialogs {...actions} />
      </div>
    </EditorDialogsContext.Provider>
  );
}
