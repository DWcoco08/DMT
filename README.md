# DevPulse

> Your dev workflow. One platform. Zero friction.

DevPulse is a developer productivity platform that brings together time tracking, task management, focus timers, analytics, and notes — everything you need to stay productive and ship faster.

---

## Features

### Core
- **Dashboard** — Customizable bento grid with drag-and-drop widgets. Add, remove, and reorder to fit your workflow.
- **Tasks** — Full task management with search, project filter, sort (newest/oldest/name), status tabs (All/Pending/Done), inline editing (double-click to rename), and project assignment.
- **Projects** — Color-coded project organization with detail view showing tasks, completion rate, and tracked hours.
- **Time Tracking** — Start/stop timer per project. Sessions persist across page refresh. Full session history with date range and project filters.

### Focus & Analytics
- **Pomodoro Timer** — Cyberpunk-styled focus timer with 25/5/15 min cycles, auto-switch between work and break, browser notifications, session counter.
- **Reports** — All-time stats (total hours, sessions, avg hours/day, longest session), daily/weekly productivity charts, hours-by-project breakdown.
- **Timer Notifications** — Automatic alerts at 1h, 2h, and 4h thresholds with visual timer color changes.

### Productivity
- **Notes** — Developer journal with two-column layout (note list + editor), auto-save on typing, create/delete.
- **Data Export** — Export tasks and time sessions as CSV, or full backup as JSON. Danger zone for account data reset.
- **GitHub Integration** — Connect via Personal Access Token, view commits per day chart and recent push history on dashboard.

### Platform
- **Authentication** — Email/password signup with password strength meter, forgot password flow, session persistence.
- **Theme** — Light, Dark, and System modes with red-black accent palette.
- **Command Palette** — `Ctrl+K` to navigate anywhere, switch theme, or trigger actions.
- **Realtime Sync** — Supabase Realtime keeps data in sync across multiple tabs.
- **Responsive** — Mobile sidebar with hamburger menu, adaptive layouts.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite 8, TailwindCSS 4, shadcn/ui |
| **State** | Zustand (client), TanStack Query (server) |
| **UI** | Framer Motion, Recharts, @dnd-kit, cmdk, Lucide Icons |
| **Backend** | Supabase (PostgreSQL, Auth, RLS, Realtime) |
| **Tooling** | pnpm, Turborepo |

---

## Project Structure

```
devpulse/
├── apps/
│   ├── frontend/              # React SPA
│   │   ├── src/
│   │   │   ├── app/           # Router, layouts, providers
│   │   │   ├── components/    # Shared UI (shadcn, BentoCard, CommandPalette)
│   │   │   ├── features/      # Feature modules
│   │   │   │   ├── auth/      # Login, signup, forgot password
│   │   │   │   ├── dashboard/ # Widgets, drag-and-drop grid
│   │   │   │   ├── tasks/     # Task CRUD, filters, inline edit
│   │   │   │   ├── projects/  # Project management, detail view
│   │   │   │   ├── time-tracking/ # Timer, sessions, time log
│   │   │   │   ├── pomodoro/  # Focus timer with cyber UI
│   │   │   │   ├── analytics/ # Charts, reports, stats
│   │   │   │   ├── notes/     # Dev journal, auto-save editor
│   │   │   │   ├── activity/  # Activity feed
│   │   │   │   ├── github/    # GitHub commits integration
│   │   │   │   └── settings/  # Profile, theme, data export
│   │   │   ├── hooks/         # useDebounce, useMediaQuery, useNotification, useRealtimeSync
│   │   │   ├── lib/           # Supabase client, utils, export helpers
│   │   │   ├── stores/        # Zustand stores (theme, timer, pomodoro, dashboard)
│   │   │   └── types/         # TypeScript interfaces
│   │   └── public/            # Static assets, logo
│   └── backend/
│       └── supabase/migrations/  # SQL schema + RLS policies
├── package.json               # Root (Turborepo)
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install

```bash
git clone <repo-url>
cd devpulse
pnpm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run these migration files in order:
   - `apps/backend/supabase/migrations/001_initial_schema.sql`
   - `apps/backend/supabase/migrations/002_notes.sql`
3. Copy your **Project URL** and **anon public key** from **Settings > API**

### 3. Configure environment

```bash
# Create env file
cat > apps/frontend/.env.local << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
```

### 4. Start development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) — create an account and start tracking.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turborepo) |
| `pnpm build` | Production build with type checking |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm --filter @devpulse/frontend dev` | Run frontend only |

---

## Usage Guide

### First steps

1. **Sign up** — Create an account with email and password
2. **Create a project** — Go to **Projects** → **New Project**, pick a name and color
3. **Add tasks** — Go to **Tasks**, type a task title, assign to a project, press Enter
4. **Start tracking time** — On the **Dashboard**, select a project in the Timer widget and click Start
5. **View progress** — Check **Reports** for charts and stats

### Pomodoro workflow

1. Go to **Pomodoro** from the sidebar
2. Select a target project (bottom-right)
3. Click **Engage** to start a 25-minute focus session
4. When the timer ends, you get a browser notification and it auto-switches to break
5. After 4 focus sessions, you get a 15-minute long break

### Connect GitHub

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) → **Generate new token (classic)**
2. No scopes needed for public repos. For private repos, enable `repo` scope
3. Copy the token (starts with `ghp_`)
4. In DevPulse, go to **Settings** → **GitHub Integration**
5. Paste the token and click **Connect GitHub**
6. Your commits chart and recent pushes will appear on the Dashboard

### Export your data

1. Go to **Data** from the sidebar
2. Choose what to export:
   - **Tasks** → CSV with title, project, status, date
   - **Time Sessions** → CSV with project, start/end times, duration
   - **Full Backup** → JSON with all your data
3. Files download instantly to your computer

### Customize the Dashboard

1. Click **Customize** on the Dashboard page
2. Drag widgets to reorder them
3. Click **X** on a widget to remove it
4. Click **Add** to bring back hidden widgets
5. Click **Done** — your layout is saved automatically

### Notes

1. Go to **Notes** from the sidebar
2. Click **New Note** to create one
3. Click a note in the list to open it in the editor
4. Just type — notes auto-save as you write

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open command palette |
| Navigate to any page, switch theme, start/stop timer from the palette |

---

## Architecture Decisions

- **Zustand** for client-only state (timer ticks, theme, pomodoro, dashboard layout). **TanStack Query** for all server state.
- **Service layer pattern** — all Supabase calls go through service files, never directly in components.
- **Row Level Security** — enforced at database level, no user ID filtering in app code.
- **Feature-based folders** — each feature is self-contained with components, hooks, services, and schemas.
- **Activity logging** — automatic via mutation `onSuccess` callbacks, no manual logging needed.

---

## License

MIT
