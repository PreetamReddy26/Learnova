-- Phase 4: Study Planner, Goals, and XP ledger (streak/achievements computed
-- live from xp_events rather than stored as mutable counters).

create type public.goal_type as enum ('weekly', 'monthly', 'subject', 'revision');

create table public.study_plan_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid references public.subjects (id),
  title text not null,
  scheduled_date date not null,
  duration_minutes smallint,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.study_plan_items enable row level security;

create policy "Students manage their own study plan items"
  on public.study_plan_items for all
  to authenticated
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  type public.goal_type not null,
  target_count smallint not null,
  current_count smallint not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "Students manage their own goals"
  on public.goals for all
  to authenticated
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- Append-only XP ledger: streaks and achievements are derived from this at
-- read time rather than stored as separately-maintained counters.
create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  amount smallint not null,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.xp_events enable row level security;

create policy "Students view their own xp events"
  on public.xp_events for select
  to authenticated
  using (auth.uid() = student_id);

create policy "Students insert their own xp events"
  on public.xp_events for insert
  to authenticated
  with check (auth.uid() = student_id);
