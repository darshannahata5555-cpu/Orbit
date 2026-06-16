-- ════════════════════════════════════════════════════════════════
--  Orbit · Seed data (mirrors the prototype's demo content)
--  Run AFTER schema.sql + policies.sql.
--  NOTE: This seeds rows without auth accounts. When a teammate signs
--  up with a matching email, handle_new_auth_user() links them.
-- ════════════════════════════════════════════════════════════════

-- Users ----------------------------------------------------------------
insert into public.users (id, email, name, initials, role, dept) values
  ('11111111-1111-1111-1111-111111111111', 'aarav@orbit.app',  'Aarav Mehta',  'AM', 'HOD',    'Technicals'),
  ('22222222-2222-2222-2222-222222222222', 'sana@orbit.app',   'Sana Dewan',   'SD', 'Core',   'Technicals'),
  ('33333333-3333-3333-3333-333333333333', 'rohan@orbit.app',  'Rohan Kapoor', 'RK', 'Member', 'Technicals'),
  ('44444444-4444-4444-4444-444444444444', 'priya@orbit.app',  'Priya Tandon', 'PT', 'Member', 'Technicals'),
  ('55555555-5555-5555-5555-555555555555', 'jiya@orbit.app',   'Jiya Nair',    'JN', 'Member', 'Sponsorship')
on conflict (id) do nothing;

-- Announcements --------------------------------------------------------
insert into public.announcements (tag, title, body, meta, pinned) values
  ('Urgent', 'Main stage rehearsal moved to 6 PM', 'All Technicals & Proshows POCs report to Audi 1. Bring updated cue sheets.', 'Pinned · Global', true),
  ('Dept',   'Sound check slots now open', 'Book a 30-min slot for your Day 2 acts via the Technicals channel.', 'Technicals · 2h ago', false),
  ('Info',   'ID badges ready for pickup', 'Collect crew badges from the Ops desk, Block C.', 'Ops & Logistics · 5h ago', false);

-- Tasks ----------------------------------------------------------------
insert into public.tasks (title, status, priority, due_label, due_at, poc_id, dept, progress, cross_dept, dependency) values
  ('Finalize LED wall vendor quotes', 'In Progress', 'High',   'Today, 5 PM', now() + interval '4 hours',  '33333333-3333-3333-3333-333333333333', 'Technicals',  70, false, null),
  ('Stage lighting plot — Day 1',     'Pending',     'Medium', 'Tomorrow',    now() + interval '1 day',    '22222222-2222-2222-2222-222222222222', 'Technicals',  30, false, null),
  ('Cue sheet sign-off',              'Waiting for Dependency', 'High', '18 Jun', now() + interval '2 days', '11111111-1111-1111-1111-111111111111', 'Technicals', 10, true,  'Creatives PR & M'),
  ('Mic inventory & spares check',    'Blocked',     'Medium', '17 Jun',      now() - interval '1 day',    '44444444-4444-4444-4444-444444444444', 'Technicals',   0, false, null),
  ('Sponsor branding on LED loop',    'Pending',     'High',   '19 Jun',      now() + interval '3 days',   '55555555-5555-5555-5555-555555555555', 'Sponsorship',  0, true,  'Technicals'),
  ('Rehearsal schedule lock',         'Pending',     'High',   '15 Jun',      now() - interval '1 day',    '11111111-1111-1111-1111-111111111111', 'Technicals',  20, false, null),
  ('Backstage power audit',           'Completed',   'Low',    '14 Jun',      now() - interval '2 days',   '33333333-3333-3333-3333-333333333333', 'Technicals', 100, false, null),
  ('Speaker placement plan',          'Verified',    'Medium', '12 Jun',      now() - interval '4 days',   '22222222-2222-2222-2222-222222222222', 'Technicals', 100, false, null);

-- Finance --------------------------------------------------------------
insert into public.finance_budgets (dept, allocated, spent, pending) values
  ('Technicals', 250000, 168500, 32400)
on conflict (dept) do nothing;

insert into public.finance_requests (requester_id, title, amount, category, date_label, invoice, dept, status) values
  ('44444444-4444-4444-4444-444444444444', 'Wireless mic batteries (×24)', 8400,  'Equipment',   '14 Jun', 'INV-2291', 'Technicals', 'Pending'),
  ('33333333-3333-3333-3333-333333333333', 'LED wall transport — vendor',  15000, 'Logistics',   '13 Jun', 'INV-2287', 'Technicals', 'Pending'),
  ('22222222-2222-2222-2222-222222222222', 'Gel sheets & gaffer tape',     3200,  'Consumables', '12 Jun', 'INV-2280', 'Technicals', 'Pending');

insert into public.claims (user_id, title, amount, status, date_label) values
  ('11111111-1111-1111-1111-111111111111', 'Stage crew refreshments',    2100, 'Reimbursed', '10 Jun'),
  ('11111111-1111-1111-1111-111111111111', 'Cable adapters & connectors',5800, 'Approved',   '11 Jun'),
  ('11111111-1111-1111-1111-111111111111', 'Backup SD cards',            1900, 'Pending',    '15 Jun');

-- Files ----------------------------------------------------------------
insert into public.folders (id, name, kind) values
  ('aaaaaaa1-0000-0000-0000-000000000001', 'Department Files',  'accent'),
  ('aaaaaaa1-0000-0000-0000-000000000002', 'Event Files',       'blue'),
  ('aaaaaaa1-0000-0000-0000-000000000003', 'Finance Documents', 'green'),
  ('aaaaaaa1-0000-0000-0000-000000000004', 'Sponsors',          'amber'),
  ('aaaaaaa1-0000-0000-0000-000000000005', 'Creative Assets',   'red')
on conflict (id) do nothing;

insert into public.files (folder_id, name, type, size_label, date_label, starred) values
  ('aaaaaaa1-0000-0000-0000-000000000002', 'LED Wall Layout v3.pdf',     'PDF', '2.4 MB', 'Today',     true),
  ('aaaaaaa1-0000-0000-0000-000000000002', 'Day 1 Run Sheet.xlsx',       'XLS', '88 KB',  'Today',     false),
  ('aaaaaaa1-0000-0000-0000-000000000005', 'Stage Render Final.png',     'IMG', '5.1 MB', 'Yesterday', true),
  ('aaaaaaa1-0000-0000-0000-000000000004', 'Sound Vendor Contract.pdf',  'PDF', '640 KB', '14 Jun',    false),
  ('aaaaaaa1-0000-0000-0000-000000000001', 'Crew Roster.docx',           'DOC', '120 KB', '13 Jun',    false);

-- Messaging ------------------------------------------------------------
-- A DM between Aarav (HOD) and Sana, seeded with the demo thread.
insert into public.conversations (id, name, kind) values
  ('bbbbbbb1-0000-0000-0000-000000000001', 'Sana Dewan', 'DM')
on conflict (id) do nothing;

insert into public.conversation_members (conversation_id, user_id) values
  ('bbbbbbb1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbb1-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222')
on conflict do nothing;

insert into public.messages (conversation_id, sender_id, kind, body, file_name, file_size, duration) values
  ('bbbbbbb1-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'text', 'Hey, did the LED vendor confirm the install slot?', null, null, null),
  ('bbbbbbb1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'text', 'Yes — locked for 2 PM tomorrow. Sending the layout now.', null, null, null),
  ('bbbbbbb1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'file', null, 'LED Wall Layout v3.pdf', '2.4 MB', null),
  ('bbbbbbb1-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'text', 'Perfect, that works 🙌', null, null, null),
  ('bbbbbbb1-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'voice', null, null, null, '0:14'),
  ('bbbbbbb1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'text', 'Can you confirm the rigging crew is briefed?', null, null, null);
