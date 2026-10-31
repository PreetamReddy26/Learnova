create function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.role() = 'authenticated' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

revoke execute on function public.prevent_role_change() from public;

create trigger prevent_role_change_on_profiles
  before update on public.profiles
  for each row execute function public.prevent_role_change();
