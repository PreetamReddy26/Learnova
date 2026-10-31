-- Phase 5: Parent-child linking and Teacher classes/assignments.

-- Invite code so a parent can link to a student without any table exposing
-- the full profiles list to other users.
alter table public.profiles add column invite_code text unique;

update public.profiles
set invite_code = upper(substr(md5(random()::text || id::text), 1, 6))
where invite_code is null;

alter table public.profiles alter column invite_code set not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, invite_code)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student'),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    upper(substr(md5(random()::text || new.id::text), 1, 6))
  );
  return new;
end;
$$;

create table public.parent_child_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (parent_id, student_id)
);

alter table public.parent_child_links enable row level security;

create policy "Parents view their own child links"
  on public.parent_child_links for select
  to authenticated
  using (auth.uid() = parent_id);

-- Linking only happens through this function so a parent never needs (and
-- never gets) broad read access to the profiles table to find a code match.
create function public.link_child_by_invite_code(code text)
returns table (student_id uuid, full_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  found_student_id uuid;
  found_full_name text;
begin
  select p.id, p.full_name into found_student_id, found_full_name
  from public.profiles p
  where p.invite_code = code and p.role = 'student';

  if found_student_id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.parent_child_links (parent_id, student_id)
  values (auth.uid(), found_student_id)
  on conflict (parent_id, student_id) do nothing;

  return query select found_student_id, found_full_name;
end;
$$;

revoke execute on function public.link_child_by_invite_code(text) from public;
grant execute on function public.link_child_by_invite_code(text) to authenticated;

-- Parents can read (never write) their linked children's data.
create policy "Parents view linked students profiles"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.parent_child_links l
      where l.parent_id = auth.uid() and l.student_id = profiles.id
    )
  );

create policy "Parents view linked students quizzes"
  on public.quizzes for select
  to authenticated
  using (
    exists (
      select 1 from public.parent_child_links l
      where l.parent_id = auth.uid() and l.student_id = quizzes.student_id
    )
  );

create policy "Parents view linked students quiz attempts"
  on public.quiz_attempts for select
  to authenticated
  using (
    exists (
      select 1 from public.parent_child_links l
      where l.parent_id = auth.uid() and l.student_id = quiz_attempts.student_id
    )
  );

create policy "Parents view linked students study plan items"
  on public.study_plan_items for select
  to authenticated
  using (
    exists (
      select 1 from public.parent_child_links l
      where l.parent_id = auth.uid() and l.student_id = study_plan_items.student_id
    )
  );

create policy "Parents view linked students xp events"
  on public.xp_events for select
  to authenticated
  using (
    exists (
      select 1 from public.parent_child_links l
      where l.parent_id = auth.uid() and l.student_id = xp_events.student_id
    )
  );

-- Teacher classes, rosters, and assignments.
create table public.teacher_classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  class_code text not null unique,
  created_at timestamptz not null default now()
);

alter table public.teacher_classes enable row level security;

create policy "Teachers manage their own classes"
  on public.teacher_classes for all
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create table public.class_students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.teacher_classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (class_id, student_id)
);

alter table public.class_students enable row level security;

create policy "Teachers view their class rosters"
  on public.class_students for select
  to authenticated
  using (
    exists (
      select 1 from public.teacher_classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  );

create policy "Students view their own class memberships"
  on public.class_students for select
  to authenticated
  using (auth.uid() = student_id);

-- Joining only happens through this function, mirroring the invite-code
-- pattern above so class codes aren't broadly browsable.
create function public.join_class_by_code(code text)
returns table (class_id uuid, class_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  found_class_id uuid;
  found_class_name text;
begin
  select c.id, c.name into found_class_id, found_class_name
  from public.teacher_classes c
  where c.class_code = code;

  if found_class_id is null then
    raise exception 'Invalid class code';
  end if;

  insert into public.class_students (class_id, student_id)
  values (found_class_id, auth.uid())
  on conflict (class_id, student_id) do nothing;

  return query select found_class_id, found_class_name;
end;
$$;

revoke execute on function public.join_class_by_code(text) from public;
grant execute on function public.join_class_by_code(text) to authenticated;

create policy "Teachers view profiles of their class students"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.class_students cs
      join public.teacher_classes c on c.id = cs.class_id
      where cs.student_id = profiles.id and c.teacher_id = auth.uid()
    )
  );

create policy "Teachers view quizzes of their class students"
  on public.quizzes for select
  to authenticated
  using (
    exists (
      select 1 from public.class_students cs
      join public.teacher_classes c on c.id = cs.class_id
      where cs.student_id = quizzes.student_id and c.teacher_id = auth.uid()
    )
  );

create policy "Teachers view quiz attempts of their class students"
  on public.quiz_attempts for select
  to authenticated
  using (
    exists (
      select 1 from public.class_students cs
      join public.teacher_classes c on c.id = cs.class_id
      where cs.student_id = quiz_attempts.student_id and c.teacher_id = auth.uid()
    )
  );

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.teacher_classes (id) on delete cascade,
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  subject_id uuid references public.subjects (id),
  due_date date,
  created_at timestamptz not null default now()
);

alter table public.assignments enable row level security;

create policy "Teachers manage assignments for their own classes"
  on public.assignments for all
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "Students view assignments for their classes"
  on public.assignments for select
  to authenticated
  using (
    exists (
      select 1 from public.class_students cs
      where cs.class_id = assignments.class_id and cs.student_id = auth.uid()
    )
  );
