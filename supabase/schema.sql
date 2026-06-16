-- ════════════════════════════════════════════════════════════════
--  Orbit · Database schema
--  Run this in the Supabase SQL editor (Project → SQL → New query).
--  Order: schema.sql → policies.sql → seed.sql
-- ════════════════════════════════════════════════════════════════

-- Enums ----------------------------------------------------------------
do $$ begin
  create type orbit_role     as enum ('HOD', 'Core', 'Member');
  create type task_status    as enum ('Pending', 'In Progress', 'Waiting for Dependency', 'Blocked', 'Completed', 'Verified');
  create type task_priority  as enum ('Low', 'Medium', 'High');
  create type claim_status   as enum ('Pending', 'Approved', 'Rejected', 'Reimbursed');
  create type convo_kind     as enum ('DM', 'Channel', 'Group');
  create type message_kind   as enum ('text', 'file', 'voice');
exception when duplicate_object then null; end $$;

-- Users ----------------------------------------------------------------
-- public.users mirrors auth.users (linked via auth_id). Seed rows can
-- exist without an auth account; they get linked on first sign-in.
create table if not exists public.users (
  id        uuid primary key default gen_random_uuid(),
  auth_id   uuid unique references auth.users (id) on delete set null,
  email     text unique,
  name      text not null,
  initials  text not null,
  role      orbit_role not null default 'Member',
  dept      text not null default 'Technicals',
  created_at timestamptz not null default now()
);

-- Announcements --------------------------------------------------------
create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  tag        text not null default 'Info',          -- Urgent | Dept | Info
  title      text not null,
  body       text not null,
  meta       text,
  dept       text,
  pinned     boolean not null default false,
  created_at timestamptz not null default now()
);

-- Tasks ----------------------------------------------------------------
create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  description text,
  status     task_status not null default 'Pending',
  priority   task_priority not null default 'Medium',
  due_label  text,                                  -- friendly label e.g. "Today, 5 PM"
  due_at     timestamptz,                           -- machine date used to compute "overdue"
  poc_id     uuid references public.users (id) on delete set null,
  dept       text not null default 'Technicals',
  progress   int  not null default 0 check (progress between 0 and 100),
  cross_dept boolean not null default false,
  dependency text,                                  -- e.g. "Creatives PR & M"
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Finance budget (one row per department) ------------------------------
create table if not exists public.finance_budgets (
  dept       text primary key,
  allocated  bigint not null default 0,
  spent      bigint not null default 0,
  pending    bigint not null default 0
  -- "remaining" is derived: allocated - spent
);

-- Reimbursement requests (raised by members, approved by HOD) ----------
create table if not exists public.finance_requests (
  id          uuid primary key default gen_random_uuid(),
  requester_id uuid references public.users (id) on delete set null,
  title       text not null,
  amount      bigint not null,
  category    text not null default 'Equipment',
  date_label  text,
  invoice     text,
  dept        text not null default 'Technicals',
  status      claim_status not null default 'Pending',
  created_at  timestamptz not null default now()
);

-- My claims (the current user's own reimbursements) --------------------
create table if not exists public.claims (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.users (id) on delete cascade,
  title      text not null,
  amount     bigint not null,
  category   text not null default 'Equipment',
  status     claim_status not null default 'Pending',
  date_label text,
  created_at timestamptz not null default now()
);

-- Files ----------------------------------------------------------------
create table if not exists public.folders (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,
  kind  text not null default 'accent',
  dept  text
);

create table if not exists public.files (
  id         uuid primary key default gen_random_uuid(),
  folder_id  uuid references public.folders (id) on delete set null,
  name       text not null,
  type       text not null default 'PDF',           -- PDF | XLS | IMG | DOC
  size_label text,
  date_label text,
  starred    boolean not null default false,
  storage_path text,                                -- path in the 'files' storage bucket
  created_at timestamptz not null default now()
);

-- Messaging ------------------------------------------------------------
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  kind       convo_kind not null default 'DM',
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid references public.conversations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations (id) on delete cascade,
  sender_id       uuid references public.users (id) on delete set null,
  kind            message_kind not null default 'text',
  body            text,
  file_name       text,
  file_size       text,
  duration        text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_tasks_dept            on public.tasks (dept);
create index if not exists idx_requests_dept         on public.finance_requests (dept);
create index if not exists idx_messages_conversation on public.messages (conversation_id, created_at);

-- Helper: auto-create a public.users row when someone signs up ----------
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer as $$
begin
  -- Link to a pre-seeded row by email if one exists, else create a new one.
  update public.users
     set auth_id = new.id
   where email = new.email and auth_id is null;

  if not found then
    insert into public.users (auth_id, email, name, initials, role, dept)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
      upper(left(coalesce(new.raw_user_meta_data ->> 'name', new.email), 2)),
      'Member',
      'Technicals'
    );
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Helper functions used by RLS policies --------------------------------
create or replace function public.current_app_user()
returns public.users language sql stable as $$
  select * from public.users where auth_id = auth.uid() limit 1;
$$;

create or replace function public.is_hod()
returns boolean language sql stable as $$
  select exists (select 1 from public.users where auth_id = auth.uid() and role = 'HOD');
$$;
