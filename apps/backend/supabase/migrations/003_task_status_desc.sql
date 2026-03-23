-- Add status column (pending, in_progress, completed)
alter table public.tasks add column if not exists status text not null default 'pending';

-- Add description column
alter table public.tasks add column if not exists description text default null;

-- Migrate existing completed tasks
update public.tasks set status = 'completed' where completed = true;
