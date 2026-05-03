# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Completed

## Current Goal

- Feature 07: Wire Editor Home ✓

## Completed

- **Feature 07: Wire Editor Home**
  - `lib/projects.ts` — `getProjectData()` server helper; fetches owned projects by `ownerId`, shared by collaborator email via `currentUser()`; returns `ProjectRow[]` with `owned` boolean
  - `app/api/projects/route.ts` — POST now accepts optional `id` field so client-generated room IDs stay aligned with Liveblocks
  - `hooks/use-project-actions.ts` — replaces `use-project-dialogs`; manages dialog state + real API calls; create slugifies name + generates short suffix for room ID, navigates to `/editor/[id]`; rename calls `PATCH` and refreshes; delete calls `DELETE`, redirects to `/editor` if active workspace, otherwise refreshes
  - `hooks/use-editor-dialogs-context.ts` — updated to reference `useProjectActions`
  - `components/editor/project-sidebar.tsx` — accepts `ownedProjects`/`sharedProjects` props; removed `MOCK_PROJECTS` dependency
  - `components/editor/editor-shell.tsx` — accepts project data props, passes to sidebar; uses `useProjectActions`
  - `app/editor/layout.tsx` — converted to async server component; fetches project data via `getProjectData()`, passes to `EditorShell`
  - `npm run build` passes

- **Feature 06: Project APIs**
  - `lib/project-auth.ts` — `requireProjectOwner` helper; throws `NotFoundError` / `ForbiddenError`
  - `app/api/projects/route.ts` — `GET` lists owner's projects; `POST` creates (defaults name to "Untitled Project")
  - `app/api/projects/[projectId]/route.ts` — `PATCH` renames (owner-only); `DELETE` deletes (owner-only); 401 for unauthenticated, 403 for non-owner
  - `npm run build` passes

- **Feature 05: Prisma Models + Client**
  - `prisma/models/project.prisma` — Project (ownerId, name, description, status enum DRAFT/ARCHIVED, canvasJsonPath, timestamps, indexes on ownerId and createdAt) + ProjectCollaborator (cascade delete, unique project/email, indexes on email and projectId+createdAt)
  - `lib/prisma.ts` — cached singleton, Accelerate branch for `prisma+postgres://`, pg adapter otherwise, `global` cache for dev hot reloads, fails fast on missing DATABASE_URL
  - Migration `init` applied, client generated to `app/generated/prisma/`
  - `npm run build` passes

- **Feature 04: Project Dialogs**
  - `lib/mock-projects.ts` — `Project` interface + 3 mock projects (2 owned, 1 shared)
  - `hooks/use-project-dialogs.ts` — dialog state, form state, loading state, slug generation
  - `hooks/use-editor-dialogs-context.ts` — React context + `useEditorDialogs` hook for page-level access
  - `components/editor/project-dialogs.tsx` — Create (with live slug preview), Rename (auto-focus, Enter submits), Delete (destructive) dialogs
  - `app/editor/page.tsx` — editor home with heading, description, New Project button
  - `components/editor/project-sidebar.tsx` — project list items, owned-only rename/delete actions (popover menu), mobile backdrop scrim
  - `components/editor/editor-shell.tsx` — wires `useProjectDialogs`, provides `EditorDialogsContext`, renders `ProjectDialogs`
  - TypeScript and lint pass clean

- **Feature 03: Auth**
  - `@clerk/ui` installed
  - `proxy.ts` created at root — protected-first strategy using `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` env vars
  - `app/layout.tsx` wraps root with `ClerkProvider` using `dark` theme from `@clerk/ui/themes`, CSS variables applied for colors/font/radius
  - `app/page.tsx` redirects authenticated users to `/editor`, unauthenticated to `/sign-in`
  - `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (logo+tagline+features left, Clerk form right); form-only on small screens
  - `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout
  - `UserButton` added to editor navbar right section
  - `npm run build` passes clean

- **Feature 02: Editor chrome**
  - `components/editor/editor-navbar.tsx` — fixed-height navbar with sidebar toggle (`PanelLeftOpen`/`PanelLeftClose`), left/center/right sections, dark background + bottom border
  - `components/editor/project-sidebar.tsx` — floating overlay sidebar (does not push content), slides in from left, Projects header + close button, My Projects / Shared tabs with empty states, full-width New Project button at bottom
  - TypeScript compiles clean, no lint errors

- **Feature 01: Design system**
  - shadcn/ui initialized (base-nova preset, Tailwind v4, CSS variables)
  - Components added to `components/ui/`: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - `lucide-react` installed
  - `lib/utils.ts` created with `cn()` helper (clsx + tailwind-merge)
  - `app/globals.css` rewritten with project design tokens (`--bg-base`, `--text-primary`, etc.) mapped to shadcn variables and Tailwind utility names
  - Removed `.dark` class block and `@custom-variant dark` — dark-only, no class switching
  - `app/layout.tsx` loads Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`)
  - TypeScript compiles clean

## In Progress

- None.

## Next Up

- Feature 08 (TBD)

## Open Questions

- None.

## Architecture Decisions

- Using shadcn/ui (base-nova preset) on Tailwind v4 + Next.js 16. Components use `@base-ui/react` primitives (not Radix). Components live in `components/ui/` and must not be modified after installation.
- Dark-only theme: all CSS variables live in `:root` only. No `.dark` class, no `@custom-variant dark`, no light mode.

## Session Notes

- **Next.js** 16.2.4 | **React** 19.2.4 | **Tailwind CSS** 4.2.4
- **shadcn** 4.6.0 — `--defaults` selected the Nova preset (Lucide/Geist, base-ui primitives)
- **lucide-react** 1.14.0
