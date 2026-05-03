import { EditorShell } from "@/components/editor/editor-shell";
import { getProjectData } from "@/lib/projects";

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const { owned, shared } = await getProjectData();
  return (
    <EditorShell ownedProjects={owned} sharedProjects={shared}>
      {children}
    </EditorShell>
  );
}
