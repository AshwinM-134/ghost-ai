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
