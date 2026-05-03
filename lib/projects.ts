import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type ProjectRow = {
  id: string;
  name: string;
  owned: boolean;
  createdAt: Date;
};

export async function getProjectData(): Promise<{
  owned: ProjectRow[];
  shared: ProjectRow[];
}> {
  const { userId } = await auth();
  if (!userId) return { owned: [], shared: [] };

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  const [ownedRaw, sharedRaw] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { email },
          include: {
            project: { select: { id: true, name: true, createdAt: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return {
    owned: ownedRaw.map((p) => ({ ...p, owned: true })),
    shared: sharedRaw.map((c) => ({ ...c.project, owned: false })),
  };
}
