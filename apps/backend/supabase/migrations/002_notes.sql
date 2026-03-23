-- Notes table for dev journal
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default '',
  content text not null default '',
  created_at timestamptz default now() not null
);

alter table public.notes enable row level security;

create policy "Users can CRUD own notes"
  on public.notes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_notes_user_id on public.notes(user_id);
create index idx_notes_created_at on public.notes(created_at desc);
