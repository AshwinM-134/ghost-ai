# Project APIs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add REST API routes for listing, creating, renaming, and deleting projects, secured by Clerk auth and owner checks.

**Architecture:** Four Next.js route handlers under `app/api/projects/` — a collection route (`route.ts`) for GET/POST and a resource route (`[projectId]/route.ts`) for PATCH/DELETE. Auth is handled via Clerk's `auth()` helper. A shared `lib/project-auth.ts` module centralizes the ownership guard so route handlers stay thin.

**Tech Stack:** Next.js 16 App Router route handlers, Clerk (`@clerk/nextjs`), Prisma Client (`app/generated/prisma`), TypeScript strict mode.

---

## File Map

| File | Created / Modified | Responsibility |
|---|---|---|
| `lib/project-auth.ts` | Create | Fetch a project and verify the caller is the owner; returns project or throws typed error |
| `app/api/projects/route.ts` | Create | `GET /api/projects` (list) and `POST /api/projects` (create) |
| `app/api/projects/[projectId]/route.ts` | Create | `PATCH /api/projects/[projectId]` (rename) and `DELETE /api/projects/[projectId]` (delete) |

---

### Task 1: Owner-guard helper (`lib/project-auth.ts`)

**Files:**
- Create: `lib/project-auth.ts`

- [ ] **Step 1: Write the file**

```typescript
// lib/project-auth.ts
import { prisma } from "@/lib/prisma";

export class NotFoundError extends Error {}
export class ForbiddenError extends Error {}

export async function requireProjectOwner(
  projectId: string,
  userId: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new NotFoundError("Project not found");
  if (project.ownerId !== userId) throw new ForbiddenError("Forbidden");

  return project;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/project-auth.ts
git commit -m "feat: add requireProjectOwner helper"
```

---

### Task 2: Collection route — GET and POST (`app/api/projects/route.ts`)

**Files:**
- Create: `app/api/projects/route.ts`

- [ ] **Step 1: Create the route handler**

```typescript
// app/api/projects/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name: string = typeof body.name === "string" && body.name.trim()
    ? body.name.trim()
    : "Untitled Project";

  const project = await prisma.project.create({
    data: { ownerId: userId, name },
  });

  return NextResponse.json(project, { status: 201 });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/projects/route.ts
git commit -m "feat: add GET /api/projects and POST /api/projects"
```

---

### Task 3: Resource route — PATCH and DELETE (`app/api/projects/[projectId]/route.ts`)

**Files:**
- Create: `app/api/projects/[projectId]/route.ts`

- [ ] **Step 1: Create the route handler**

```typescript
// app/api/projects/[projectId]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireProjectOwner, NotFoundError, ForbiddenError } from "@/lib/project-auth";

type Params = { params: Promise<{ projectId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  try {
    await requireProjectOwner(projectId, userId);
  } catch (err) {
    if (err instanceof NotFoundError) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw err;
  }

  const body = await request.json().catch(() => ({}));
  if (typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name: body.name.trim() },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  try {
    await requireProjectOwner(projectId, userId);
  } catch (err) {
    if (err instanceof NotFoundError) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw err;
  }

  await prisma.project.delete({ where: { id: projectId } });

  return new NextResponse(null, { status: 204 });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/projects/[projectId]/route.ts
git commit -m "feat: add PATCH and DELETE /api/projects/[projectId]"
```

---

## Self-Review Checklist

- [x] `GET /api/projects` — lists caller's projects (Task 2)
- [x] `POST /api/projects` — creates project, defaults name to "Untitled Project" (Task 2)
- [x] `PATCH /api/projects/[projectId]` — renames, owner-only (Task 3)
- [x] `DELETE /api/projects/[projectId]` — deletes, owner-only (Task 3)
- [x] `401` for unauthenticated requests (all handlers)
- [x] `403` for non-owner mutations (Tasks 3 via `requireProjectOwner`)
- [x] Uses cuid-based IDs from schema — no sequential IDs added
- [x] `npm run build` passes (Task 3, Step 3)
- [x] No UI wiring
