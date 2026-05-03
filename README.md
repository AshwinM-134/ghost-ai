# Ghost AI

A real-time collaborative system design workspace. Describe a system in plain English, let AI map it onto a shared canvas, refine the architecture with collaborators, and generate a technical specification from the resulting graph.

---

## Table of Contents

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🚀 [Quick Start](#quick-start)
5. 📜 [Available Scripts](#available-scripts)
6. 📁 [Project Structure](#project-structure)

---

## Introduction

Ghost AI lets teams go from a natural language description to a structured architecture diagram in seconds. An AI agent generates nodes and edges on a shared canvas, collaborators refine the design in real time, and the app exports a Markdown technical specification from the final graph.

---

## Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | Next.js 16 + TypeScript      |
| Styling          | Tailwind CSS v4 + shadcn/ui  |
| Auth             | Clerk                        |
| Database         | Prisma + PostgreSQL           |
| Canvas           | Liveblocks + React Flow      |
| Background tasks | Trigger.dev                  |
| Artifact storage | Vercel Blob                  |

---

## Features

- **Authentication & Projects** — sign in with Clerk, create projects, rename and delete them, and manage collaborator access
- **Editor Home** — project sidebar listing owned and shared projects, fetched server-side on each load
- **Project API** — REST endpoints to list, create, rename, and delete projects with owner-only enforcement
- **AI Architecture Generation** — generate system designs from a natural language prompt *(coming soon)*
- **Real-time Collaboration** — shared canvas with live cursors and presence indicators *(coming soon)*
- **Starter Templates** — import prebuilt system design templates *(coming soon)*
- **Spec Generation** — convert the canvas graph into a persistent Markdown technical spec *(coming soon)*

---

## Quick Start

**Prerequisites:** Node.js 20.19.0+, npm, a PostgreSQL database

```bash
# Clone the repository
git clone https://github.com/AshwinM-134/ghost-ai.git
cd ghost-ai

# Install dependencies
npm install

# Copy the example env file and fill in your values
cp .env.example .env.local  # then edit .env.local with your real credentials

# Apply the database migration and generate the Prisma client
npx prisma migrate deploy
npx prisma generate

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Required environment variables

| Variable                         | Description                              |
| -------------------------------- | ---------------------------------------- |
| `DATABASE_URL`                   | PostgreSQL connection string             |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                 |
| `CLERK_SECRET_KEY`               | Clerk secret key                         |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`  | Sign-in page path (e.g. `/sign-in`)      |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`  | Sign-up page path (e.g. `/sign-up`)      |

---

## Available Scripts

| Script          | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Build for production               |
| `npm run start` | Start the production server        |
| `npm run lint`  | Run ESLint                         |

---

## Project Structure

```text
ghost-ai/
├── app/
│   ├── api/
│   │   └── projects/             # REST API — list/create and rename/delete projects
│   ├── editor/                   # Editor home page and layout (server component)
│   ├── sign-in/ & sign-up/       # Clerk auth pages
│   ├── globals.css               # Design tokens and base styles
│   └── layout.tsx                # Root layout with fonts and ClerkProvider
├── components/
│   ├── editor/                   # Editor chrome: navbar, sidebar, dialogs, shell
│   └── ui/                       # shadcn/ui primitive components
├── hooks/
│   ├── use-project-actions.ts    # Dialog state + project create/rename/delete mutations
│   └── use-editor-dialogs-context.ts  # React context for editor-level dialog access
├── lib/
│   ├── projects.ts               # Server-side data helper — fetches owned and shared projects
│   ├── project-auth.ts           # requireProjectOwner helper with NotFoundError / ForbiddenError
│   ├── prisma.ts                 # Cached Prisma client singleton
│   └── utils.ts                  # cn() utility
├── prisma/
│   ├── models/                   # Prisma schema split by domain
│   └── migrations/               # Applied database migrations
└── context/                      # Project documentation, specs, and progress tracker
```
