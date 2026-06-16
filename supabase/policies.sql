-- ════════════════════════════════════════════════════════════════
--  Orbit · Row-Level Security policies
--  Run AFTER schema.sql. These enforce role rules at the database
--  level, so even a tampered client cannot bypass them.
-- ════════════════════════════════════════════════════════════════

alter table public.users                enable row level security;
alter table public.announcements        enable row level security;
alter table public.tasks                enable row level security;
alter table public.finance_budgets      enable row level security;
alter table public.finance_requests     enable row level security;
alter table public.claims               enable row level security;
alter table public.folders              enable row level security;
alter table public.files                enable row level security;
alter table public.conversations        enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages             enable row level security;

-- Users: everyone signed in can read the directory; you edit only yourself
create policy "users_read"  on public.users for select to authenticated using (true);
create policy "users_self"  on public.users for update to authenticated using (auth_id = auth.uid());

-- Announcements: all read; only HOD writes
create policy "ann_read"    on public.announcements for select to authenticated using (true);
create policy "ann_hod"     on public.announcements for all    to authenticated using (public.is_hod()) with check (public.is_hod());

-- Tasks: all read; HOD full control; the assigned POC may update their task
create policy "task_read"   on public.tasks for select to authenticated using (true);
create policy "task_hod"    on public.tasks for all    to authenticated using (public.is_hod()) with check (public.is_hod());
create policy "task_poc_upd" on public.tasks for update to authenticated
  using (poc_id = (select id from public.current_app_user()));

-- Finance budget: all read; only HOD updates
create policy "budget_read" on public.finance_budgets for select to authenticated using (true);
create policy "budget_hod"  on public.finance_budgets for all    to authenticated using (public.is_hod()) with check (public.is_hod());

-- Reimbursement requests: anyone can raise one; all read; only HOD changes status
create policy "req_read"    on public.finance_requests for select to authenticated using (true);
create policy "req_insert"  on public.finance_requests for insert to authenticated
  with check (requester_id = (select id from public.current_app_user()));
create policy "req_hod"     on public.finance_requests for update to authenticated
  using (public.is_hod()) with check (public.is_hod());

-- Claims: you see and create your own; HOD can see all
create policy "claim_own"   on public.claims for select to authenticated
  using (user_id = (select id from public.current_app_user()) or public.is_hod());
create policy "claim_insert" on public.claims for insert to authenticated
  with check (user_id = (select id from public.current_app_user()));

-- Files & folders: all read; any signed-in user can add
create policy "folder_read" on public.folders for select to authenticated using (true);
create policy "folder_ins"  on public.folders for insert to authenticated with check (true);
create policy "file_read"   on public.files   for select to authenticated using (true);
create policy "file_ins"    on public.files   for insert to authenticated with check (true);
create policy "file_upd"    on public.files   for update to authenticated using (true);

-- Messaging: you only see conversations you belong to
create policy "convo_read"  on public.conversations for select to authenticated
  using (exists (select 1 from public.conversation_members m
                 where m.conversation_id = id
                   and m.user_id = (select id from public.current_app_user())));

create policy "member_read" on public.conversation_members for select to authenticated
  using (user_id = (select id from public.current_app_user()));

create policy "msg_read"    on public.messages for select to authenticated
  using (exists (select 1 from public.conversation_members m
                 where m.conversation_id = conversation_id
                   and m.user_id = (select id from public.current_app_user())));

create policy "msg_send"    on public.messages for insert to authenticated
  with check (sender_id = (select id from public.current_app_user())
              and exists (select 1 from public.conversation_members m
                          where m.conversation_id = conversation_id
                            and m.user_id = (select id from public.current_app_user())));
