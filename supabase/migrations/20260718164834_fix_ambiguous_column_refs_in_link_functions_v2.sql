drop function if exists public.link_child_by_invite_code(text);
drop function if exists public.join_class_by_code(text);

create function public.link_child_by_invite_code(code text)
returns table (linked_student_id uuid, linked_full_name text)
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

revoke execute on function public.link_child_by_invite_code(text) from public, anon;
grant execute on function public.link_child_by_invite_code(text) to authenticated;

create function public.join_class_by_code(code text)
returns table (joined_class_id uuid, joined_class_name text)
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

revoke execute on function public.join_class_by_code(text) from public, anon;
grant execute on function public.join_class_by_code(text) to authenticated;
