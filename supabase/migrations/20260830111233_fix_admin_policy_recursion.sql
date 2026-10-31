drop policy "Admins can view all profiles" on public.profiles;
drop policy "Admins can read all feedback" on public.feedback;

create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin_user());

create policy "Admins can read all feedback"
  on public.feedback for select
  using (public.is_admin_user());
