# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature 03: Auth (Clerk)

## Completed

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

- Feature 04 (TBD)

## Open Questions

- None.

## Architecture Decisions

- Using shadcn/ui (base-nova preset) on Tailwind v4 + Next.js 16. Components use `@base-ui/react` primitives (not Radix). Components live in `components/ui/` and must not be modified after installation.
- Dark-only theme: all CSS variables live in `:root` only. No `.dark` class, no `@custom-variant dark`, no light mode.

## Session Notes

- **Next.js** 16.2.4 | **React** 19.2.4 | **Tailwind CSS** 4.2.4
- **shadcn** 4.6.0 — `--defaults` selected the Nova preset (Lucide/Geist, base-ui primitives)
- **lucide-react** 1.14.0
