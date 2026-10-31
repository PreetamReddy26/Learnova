-- Learnova foundation schema: profiles, curricula, subjects
-- Phase 0 of the Learnova build plan.

create type public.user_role as enum ('student', 'parent', 'teacher');

create type public.curriculum_code as enum (
  'cbse',
  'icse',
  'isc',
  'cambridge',
  'telangana'
);

create type public.learning_style as enum (
  'visual',
  'step_by_step',
  'real_world',
  'story_based',
  'activities',
  'hands_on',
  'beginner',
  'advanced'
);

create table public.curricula (
  id uuid primary key default gen_random_uuid(),
  code public.curriculum_code not null unique,
  name text not null,
  description text
);

alter table public.curricula enable row level security;

create policy "Curricula are readable by everyone"
  on public.curricula for select
  to authenticated, anon
  using (true);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  curriculum_id uuid not null references public.curricula (id) on delete cascade,
  name text not null,
  grade_min smallint not null,
  grade_max smallint not null,
  created_at timestamptz not null default now()
);

alter table public.subjects enable row level security;

create policy "Subjects are readable by everyone"
  on public.subjects for select
  to authenticated, anon
  using (true);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text not null,
  phone text,
  school_name text,
  city text,
  curriculum_id uuid references public.curricula (id),
  grade smallint,
  learning_style public.learning_style,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up, seeded from
-- the metadata passed to supabase.auth.signUp() at Phase 2.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student'),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.curricula (code, name) values
  ('cbse', 'CBSE'),
  ('icse', 'ICSE'),
  ('isc', 'ISC'),
  ('cambridge', 'Cambridge'),
  ('telangana', 'Telangana State Board');
