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

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 + TypeScript |
| Styling          | Tailwind CSS v4 + shadcn/ui |
| Auth             | Clerk                   |
| Database         | Prisma + PostgreSQL      |
| Canvas           | Liveblocks + React Flow  |
| Background tasks | Trigger.dev             |
| Artifact storage | Vercel Blob             |

---

## Features

- **AI Architecture Generation** — generate system designs from a natural language prompt
- **Real-time Collaboration** — shared canvas with live cursors and presence indicators
- **Starter Templates** — import prebuilt system design templates (monolith, microservices, event-driven, and more)
- **Spec Generation** — convert the canvas graph into a persistent Markdown technical spec
- **Authentication & Projects** — sign in, create projects, and manage collaborator access

---

## Quick Start

**Prerequisites:** Node.js 18+, npm

```bash
# Clone the repository
git clone https://github.com/AshwinM-134/ghost-ai.git
cd ghost-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
├── app/                  # Next.js App Router — pages and API routes
│   ├── api/              # Route handlers
│   ├── globals.css       # Design tokens and base styles
│   └── layout.tsx        # Root layout with fonts
├── components/
│   ├── editor/           # Editor chrome components (navbar, shell, sidebar)
│   └── ui/               # shadcn/ui primitive components
├── lib/                  # Shared utilities and infrastructure
├── trigger/              # Durable background tasks and AI workflows
├── prisma/               # Database schema
└── context/              # Project documentation and specs
```
