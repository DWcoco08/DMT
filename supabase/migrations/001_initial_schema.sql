-- ============================================
-- DMT Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text default '#6366f1',
  created_at timestamptz default now() not null
);

-- Tasks
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  completed boolean default false not null,
  created_at timestamptz default now() not null
);

-- Time Sessions
create table public.time_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz,
  duration integer default 0,
  created_at timestamptz default now() not null
);

-- Activities
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- ============================================
-- Row Level Security
-- ============================================

alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.time_sessions enable row level security;
alter table public.activities enable row level security;

-- Projects policies
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Tasks policies
create policy "Users can view own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can create own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Time Sessions policies
create policy "Users can view own time sessions"
  on public.time_sessions for select
  using (auth.uid() = user_id);

create policy "Users can create own time sessions"
  on public.time_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own time sessions"
  on public.time_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own time sessions"
  on public.time_sessions for delete
  using (auth.uid() = user_id);

-- Activities policies
create policy "Users can view own activities"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can create own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);

-- ============================================
-- Indexes for performance
-- ============================================

create index idx_projects_user_id on public.projects(user_id);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_project_id on public.tasks(project_id);
create index idx_time_sessions_user_id on public.time_sessions(user_id);
create index idx_time_sessions_project_id on public.time_sessions(project_id);
create index idx_time_sessions_start_time on public.time_sessions(start_time);
create index idx_activities_user_id on public.activities(user_id);
create index idx_activities_created_at on public.activities(created_at desc);
