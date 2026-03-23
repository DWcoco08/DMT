# CodeCraft

A developer productivity platform for tracking time, managing tasks, and visualizing coding habits.

## Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, shadcn/ui, Zustand, TanStack Query, Recharts, Framer Motion

**Backend:** Supabase (PostgreSQL, Auth, RLS, Realtime)

**Tooling:** pnpm, Turborepo

## Project Structure

```
codecraft/
├── apps/
│   ├── frontend/        # React SPA
│   └── backend/         # Supabase migrations
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Supabase project

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp apps/frontend/.env.local.example apps/frontend/.env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
# Paste apps/backend/supabase/migrations/001_initial_schema.sql
# into your Supabase SQL Editor

# Start dev server
pnpm dev
```

### Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Features

- **Auth** — Email/password with session persistence
- **Dashboard** — Customizable bento grid with drag-and-drop widgets
- **Time Tracking** — Start/stop timer per project, session history
- **Tasks** — CRUD with filters (all/pending/completed)
- **Analytics** — Daily/weekly coding hours charts
- **Projects** — Organize work with color-coded projects
- **GitHub** — Connect via PAT, view commits per day
- **Settings** — Profile, theme (light/dark/system), project management
- **Keyboard Shortcuts** — `Ctrl+K` command palette

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start frontend dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |

## License

MIT
