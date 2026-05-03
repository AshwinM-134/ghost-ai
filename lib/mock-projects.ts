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
