-- Phase 3: AI Assistant conversations + Tests/Quizzes schema

create type public.message_role as enum ('user', 'assistant');

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid references public.subjects (id),
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "Students manage their own conversations"
  on public.conversations for all
  to authenticated
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role public.message_role not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Students manage messages in their own conversations"
  on public.messages for all
  to authenticated
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.student_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.student_id = auth.uid()
  ));

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid references public.subjects (id),
  title text not null,
  created_at timestamptz not null default now()
);

alter table public.quizzes enable row level security;

create policy "Students manage their own quizzes"
  on public.quizzes for all
  to authenticated
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  position smallint not null,
  prompt text not null,
  choices jsonb not null,
  correct_index smallint not null,
  explanation text not null
);

alter table public.quiz_questions enable row level security;

create policy "Students view questions for their own quizzes"
  on public.quiz_questions for select
  to authenticated
  using (exists (
    select 1 from public.quizzes q
    where q.id = quiz_id and q.student_id = auth.uid()
  ));

create policy "Students insert questions for their own quizzes"
  on public.quiz_questions for insert
  to authenticated
  with check (exists (
    select 1 from public.quizzes q
    where q.id = quiz_id and q.student_id = auth.uid()
  ));

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  score smallint not null,
  total smallint not null,
  answers jsonb not null,
  completed_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

create policy "Students manage their own quiz attempts"
  on public.quiz_attempts for all
  to authenticated
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- Seed a small placeholder subject catalog per curriculum (Phase 7 will
-- replace this with a real curriculum-mapped subject/chapter catalog).
insert into public.subjects (curriculum_id, name, grade_min, grade_max)
select c.id, subj.name, 1, 12
from public.curricula c
cross join (values
  ('Mathematics'),
  ('Science'),
  ('English'),
  ('Social Studies')
) as subj(name);
