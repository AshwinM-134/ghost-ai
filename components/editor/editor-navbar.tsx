"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <nav className="h-12 bg-surface border-b border-surface-border flex items-center px-3 shrink-0">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center h-8 w-8 rounded-xl text-copy-muted hover:text-copy-primary hover:bg-elevated transition-colors"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center">
        <UserButton />
      </div>
    </nav>
  );
}
