"use client";

import { X, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20"
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

            <TabsContent value="my-projects" className="flex-1">
              <div className="flex items-center justify-center h-24 text-copy-faint text-sm">
                No projects yet
              </div>
            </TabsContent>

            <TabsContent value="shared" className="flex-1">
              <div className="flex items-center justify-center h-24 text-copy-faint text-sm">
                No shared projects
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-3 border-t border-surface-border shrink-0">
          <Button className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
