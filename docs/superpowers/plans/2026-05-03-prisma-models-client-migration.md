# Prisma Models, Client Singleton, and First Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Project and ProjectCollaborator data models, a cached Prisma client singleton, and run the first migration.

**Architecture:** Multi-file Prisma v7 schema at `prisma/models/`. Client singleton in `lib/prisma.ts` branches on `DATABASE_URL` prefix — Accelerate for `prisma+postgres://`, direct `pg` adapter otherwise. Client is cached on `global` in development to survive hot reloads.

**Tech Stack:** Prisma v7, `@prisma/adapter-pg`, `@prisma/extension-accelerate`, pg, Next.js 16

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `prisma/models/project.prisma` | Project + ProjectCollaborator schema |
| Modify | `prisma/schema.prisma` | Add `url` env ref to datasource |
| Create | `lib/prisma.ts` | Cached Prisma client singleton |

---

### Task 1: Add datasource URL to existing schema

**Files:**
- Modify: `prisma/schema.prisma`

The existing `prisma/schema.prisma` has a datasource block without a `url`. Prisma v7 still requires `url` in the schema file (the `prisma.config.ts` `datasource.url` supplements but doesn't replace it).

- [ ] **Step 1: Update datasource block**

Replace the datasource block in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Full file after edit:
```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- [ ] **Step 2: Commit**

```bash
git add prisma/schema.prisma
git commit -m "chore: add DATABASE_URL to prisma datasource"
```

---

### Task 2: Create Project and ProjectCollaborator models

**Files:**
- Create: `prisma/models/project.prisma`

- [ ] **Step 1: Create the model file**

Create `prisma/models/project.prisma` with this exact content:

```prisma
enum ProjectStatus {
  DRAFT
  ARCHIVED
}

model Project {
  id              String    @id @default(cuid())
  ownerId         String    @map("owner_id")
  name            String
  description     String?
  status          ProjectStatus @default(DRAFT)
  canvasJsonPath  String?   @map("canvas_json_path")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  collaborators   ProjectCollaborator[]

  @@index([ownerId])
  @@index([createdAt])
  @@map("projects")
}

model ProjectCollaborator {
  id          String   @id @default(cuid())
  projectId   String   @map("project_id")
  email       String
  createdAt   DateTime @default(now()) @map("created_at")

  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, email])
  @@index([email])
  @@index([projectId, createdAt])
  @@map("project_collaborators")
}
```

- [ ] **Step 2: Commit**

```bash
git add prisma/models/project.prisma
git commit -m "feat: add Project and ProjectCollaborator prisma models"
```

---

### Task 3: Install Accelerate extension and create lib/prisma.ts

**Files:**
- Create: `lib/prisma.ts`

- [ ] **Step 1: Install @prisma/extension-accelerate**

```bash
npm install @prisma/extension-accelerate
```

- [ ] **Step 2: Create lib/prisma.ts**

```typescript
import { PrismaClient } from "../app/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient;
  }

  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/prisma.ts package.json package-lock.json
git commit -m "feat: add cached prisma client singleton with accelerate/pg branching"
```

---

### Task 4: Run migration and generate client

**Files:**
- Creates: `prisma/migrations/` (auto-generated)
- Creates: `app/generated/prisma/` (auto-generated)

Prerequisites: `DATABASE_URL` must be set in `.env` or environment before running these commands.

- [ ] **Step 1: Run the dev migration**

```bash
npx prisma migrate dev --name init
```

Expected output:
```
Applying migration `<timestamp>_init`
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

If `DATABASE_URL` is missing, this will fail with "Environment variable not found: DATABASE_URL". Set it first.

- [ ] **Step 2: Verify generated client exists**

```bash
ls app/generated/prisma/
```

Expected: `index.js`, `index.d.ts`, and related files present.

- [ ] **Step 3: Verify TypeScript build passes**

```bash
npm run build
```

Expected: build completes with no type errors.

- [ ] **Step 4: Update progress tracker**

In `context/progress-tracker.md`, move Feature 05 to Completed with:
```
- **Feature 05: Prisma Models + Client**
  - `prisma/models/project.prisma` — Project (ownerId, name, description, status enum, canvasJsonPath, timestamps, indexes) + ProjectCollaborator (cascade delete, unique project/email, indexes)
  - `lib/prisma.ts` — cached singleton, Accelerate branch for `prisma+postgres://`, pg adapter otherwise, `global` cache for dev hot reloads
  - Migration `init` applied, client generated to `app/generated/prisma/`
  - `npm run build` passes
```

- [ ] **Step 5: Commit**

```bash
git add prisma/migrations/ app/generated/prisma/ context/progress-tracker.md
git commit -m "feat: run init migration and generate prisma client"
```
