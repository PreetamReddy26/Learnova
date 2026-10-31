alter table public.profiles
  add column is_admin boolean not null default false;

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null,
  rating smallint check (rating between 1 and 5),
  message text not null,
  page_path text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "Users can submit their own feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

create policy "Admins can read all feedback"
  on public.feedback for select
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.is_admin = true
  ));
