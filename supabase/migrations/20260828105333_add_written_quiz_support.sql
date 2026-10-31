create type public.quiz_type as enum ('mcq', 'written');

alter table public.quizzes
  add column quiz_type public.quiz_type not null default 'mcq';

alter table public.quiz_questions
  alter column choices drop not null,
  alter column correct_index drop not null,
  alter column explanation drop not null,
  add column model_answer text;
