-- Narrow existing combined-subject grade ranges to where they're actually
-- taught as one subject, before splitting into separate subjects at higher
-- grades (matches how each board actually structures its syllabus).
--
-- (Rows are matched by curriculum code and subject name so this is
-- reproducible on a fresh database; the originally-applied version matched the
-- seed rows by their generated ids.)

update public.subjects s set grade_max = 10
from public.curricula c
where c.id = s.curriculum_id
  and ((c.code in ('cbse', 'telangana') and s.name in ('Science', 'Social Studies'))
    or (c.code = 'cambridge' and s.name = 'Social Studies'));

update public.subjects s set grade_max = 7
from public.curricula c
where c.id = s.curriculum_id and c.code = 'icse' and s.name = 'Science';

update public.subjects s set grade_max = 5
from public.curricula c
where c.id = s.curriculum_id and c.code = 'icse' and s.name = 'Social Studies';

update public.subjects s set grade_max = 8
from public.curricula c
where c.id = s.curriculum_id and c.code = 'cambridge' and s.name = 'Science';

-- ISC only ever serves grades 11-12, where science is never taught as one
-- combined subject and "Social Studies" isn't a real ISC subject: remove these
-- two generic placeholder rows in favour of the real ISC subjects below.
delete from public.subjects s
using public.curricula c
where c.id = s.curriculum_id and c.code = 'isc' and s.name in ('Science', 'Social Studies');

-- Add curriculum- and grade-appropriate subjects for every board.
insert into public.subjects (curriculum_id, name, grade_min, grade_max)
select c.id, v.name, v.grade_min, v.grade_max
from public.curricula c
join (values
  -- CBSE
  ('cbse', 'Hindi', 1, 10),
  ('cbse', 'Environmental Studies', 1, 5),
  ('cbse', 'Physics', 11, 12),
  ('cbse', 'Chemistry', 11, 12),
  ('cbse', 'Biology', 11, 12),
  ('cbse', 'Computer Science', 9, 12),
  ('cbse', 'Accountancy', 11, 12),
  ('cbse', 'Business Studies', 11, 12),
  ('cbse', 'Economics', 11, 12),
  ('cbse', 'History', 11, 12),
  ('cbse', 'Political Science', 11, 12),

  -- ICSE
  ('icse', 'Second Language (Hindi)', 1, 10),
  ('icse', 'Environmental Studies', 1, 5),
  ('icse', 'History & Civics', 6, 10),
  ('icse', 'Geography', 6, 10),
  ('icse', 'Physics', 8, 10),
  ('icse', 'Chemistry', 8, 10),
  ('icse', 'Biology', 8, 10),
  ('icse', 'Computer Applications', 9, 10),

  -- ISC (grades 11-12 only)
  ('isc', 'Physics', 11, 12),
  ('isc', 'Chemistry', 11, 12),
  ('isc', 'Biology', 11, 12),
  ('isc', 'Computer Science', 11, 12),
  ('isc', 'Accounts', 11, 12),
  ('isc', 'Commerce', 11, 12),
  ('isc', 'Economics', 11, 12),
  ('isc', 'History', 11, 12),
  ('isc', 'Political Science', 11, 12),
  ('isc', 'Psychology', 11, 12),

  -- Cambridge
  ('cambridge', 'Global Perspectives', 1, 12),
  ('cambridge', 'Physics', 9, 12),
  ('cambridge', 'Chemistry', 9, 12),
  ('cambridge', 'Biology', 9, 12),
  ('cambridge', 'Computer Science', 9, 12),
  ('cambridge', 'Economics', 11, 12),
  ('cambridge', 'Business Studies', 11, 12),

  -- Telangana State Board
  ('telangana', 'Telugu', 1, 10),
  ('telangana', 'Hindi', 1, 10),
  ('telangana', 'Environmental Studies', 1, 5),
  ('telangana', 'Physics', 11, 12),
  ('telangana', 'Chemistry', 11, 12),
  ('telangana', 'Biology', 11, 12),
  ('telangana', 'Commerce', 11, 12),
  ('telangana', 'Economics', 11, 12),
  ('telangana', 'Civics', 11, 12),
  ('telangana', 'History', 11, 12)
) as v(code, name, grade_min, grade_max) on v.code = c.code::text;
