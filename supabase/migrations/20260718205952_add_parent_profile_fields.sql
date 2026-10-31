create type public.parent_relationship as enum ('mother', 'father', 'guardian', 'other');
create type public.contact_preference as enum ('email', 'phone', 'whatsapp');

alter table public.profiles
  add column profession text,
  add column relationship_to_student public.parent_relationship,
  add column contact_preference public.contact_preference;
