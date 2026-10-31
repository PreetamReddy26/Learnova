-- WARNING: this policy queries public.profiles from inside a policy on
-- public.profiles, which recurses and breaks every profile read. It is kept
-- here as migration history; the next migration (fix_admin_policy_recursion)
-- replaces it with a SECURITY DEFINER helper.
create policy "Admins can view all profiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles as admin_check
    where admin_check.id = auth.uid() and admin_check.is_admin = true
  ));
