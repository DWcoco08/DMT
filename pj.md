You are a senior fullstack engineer and product designer.

Help me build a modern, production-quality "Developer Productivity Tool" web application.

## 🧩 Tech Stack Requirements

- Frontend:
  - React (latest stable)
  - TypeScript
  - Vite
  - pnpm (NOT npm or yarn)
  - TailwindCSS
  - shadcn/ui (for components)
  - Zustand (state management)
  - React Query (TanStack Query) for server state

- Backend:
  - Supabase (PostgreSQL, Auth, Realtime, Storage)
  - Use Supabase client SDK
  - Row Level Security (RLS)

- Other tools:
  - Zod (validation)
  - React Hook Form
  - Recharts (for analytics charts)
  - date-fns

---

## 🎯 Product Goal

Build a SaaS-style dashboard that helps developers track and improve their productivity.

The UI must be:

- Clean
- Minimal
- Modern
- Bento box layout (like modular dashboard blocks)
- Inspired by Notion / Linear / Vercel dashboards

---

## ✨ Core Features

### 1. Authentication

- Supabase Auth (email + password)
- Protected routes
- Session persistence

---

### 2. Dashboard (Main Page)

Create a bento-style layout with multiple widgets:

- ⏱ Time Tracking Widget
  - Start / Stop timer
  - Assign to project
  - Store sessions in database

- 📊 Productivity Analytics
  - Daily / weekly coding hours
  - Charts (Recharts)
  - Show trends

- 📁 Projects Overview
  - List of projects
  - Total time spent per project

- ✅ Task Manager
  - Simple task list (CRUD)
  - Mark as done
  - Filter (done / pending)

- 🔥 Activity Feed
  - Recent actions (task created, timer session, etc.)

---

### 3. GitHub Integration (Optional but preferred)

- Connect GitHub account
- Fetch commits
- Display commits per day
- Merge with productivity analytics

---

### 4. Settings Page

- Profile info
- Toggle dark/light mode
- Manage projects

---

## 🧱 Architecture Requirements

- Use feature-based folder structure
- Separate:
  - components/
  - features/
  - hooks/
  - services/
  - lib/
- Use custom hooks for logic abstraction
- API layer for Supabase calls

---

## 🎨 UI / UX Requirements

- Bento grid layout:
  - Responsive grid system
  - Cards with rounded-2xl
  - Soft shadows
  - Good spacing (p-4 / p-6)

- Design system:
  - Consistent typography
  - Neutral color palette
  - Accent color (indigo or blue)

- Animations:
  - Use Framer Motion (subtle)
  - Smooth transitions

---

## 🗄 Database Schema (Supabase)

Design tables:

- users (handled by Supabase Auth)

- projects
  - id
  - user_id
  - name
  - created_at

- tasks
  - id
  - user_id
  - project_id
  - title
  - completed
  - created_at

- time_sessions
  - id
  - user_id
  - project_id
  - start_time
  - end_time
  - duration

- activities
  - id
  - user_id
  - type (task_created, timer_started, etc.)
  - metadata (json)
  - created_at

---

## 🔐 Security

- Enable Row Level Security (RLS)
- Users can only access their own data
- Use Supabase policies

---

## ⚡ Performance

- Use React Query caching
- Lazy load heavy components
- Optimize re-renders

---

## 📦 Setup Instructions

Provide step-by-step:

1. Initialize project with pnpm + Vite + React + TS
2. Install all dependencies
3. Setup TailwindCSS
4. Setup shadcn/ui
5. Setup Supabase client
6. Environment variables
7. Folder structure

---

## 🧪 Bonus Features (if time permits)

- Pomodoro mode
- Notifications
- Weekly report email
- Keyboard shortcuts (like Linear)

---

## 📌 Output Format

I want you to:

1. Explain the architecture
2. Generate project structure
3. Provide key code snippets (not full dump)
4. Build feature by feature step-by-step
5. Explain decisions like a senior engineer

Avoid being generic. Be practical and opinionated.
