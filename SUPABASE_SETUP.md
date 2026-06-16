# Orbit · Supabase backend setup

Orbit runs on **demo (mock) data** out of the box — no backend needed.
To switch it to a real backend, connect a free Supabase project. The app
detects the keys automatically: present → live data + login; absent → demo.

---

## 1. Create a Supabase project
1. Go to <https://supabase.com> → **New project** (the free tier is enough).
2. Pick a name, a strong database password, and a region close to you.
3. Wait ~2 min for it to provision.

## 2. Create the database
In the dashboard, open **SQL Editor → New query** and run these three
files from `supabase/`, **in order**:

1. `schema.sql`   — tables, enums, triggers, helper functions
2. `policies.sql` — Row-Level Security (who can read/write what)
3. `seed.sql`     — demo content (announcements, tasks, finance, chat)

Each can be pasted and run with **Run**.

## 3. Get your API keys
**Settings → API**, copy:
- **Project URL**  → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

> The anon key is safe in the browser — Row-Level Security is what protects
> your data. Never expose the **service_role** key.

## 4. Run locally against Supabase
```bash
cp .env.example .env.local
# paste your URL + anon key into .env.local
npm install
npm run dev
```
You'll now see the **login screen**. Create an account (Sign up), confirm
the email if email confirmations are on (Authentication → Providers →
Email), then sign in.

### Linking the demo HOD account
The seed data includes Aarav Mehta (HOD, `aarav@orbit.app`). To *become*
that HOD, sign up with `aarav@orbit.app` — the `handle_new_auth_user`
trigger links your auth account to the seeded row, so you inherit the HOD
role and all its data. Any other email creates a fresh Member.

## 5. Deploy with the backend (GitHub Pages)
The deploy workflow already reads the keys from GitHub secrets:
1. Repo **Settings → Secrets and variables → Actions → New repository secret**
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Push (or re-run the workflow). The live site now uses Supabase.

If you skip this, the deployed site keeps working in demo mode.

---

## What's wired to the backend
| Area | Live behaviour |
|------|----------------|
| Auth | Email/password sign up + sign in; HOD/Member roles |
| Home | Announcements, upcoming tasks, schedule (schedule is static) |
| Tasks | List/Board/Calendar read from `tasks`; **New Task** inserts a row |
| Finance | Budget + requests read live; **Approve/Reject/Changes** persist; **Claim** inserts |
| Files | Folders + recent files read from `files`/`folders` |
| Chat | Threads load from `messages`; sending inserts a message |
| Search | Indexes loaded tasks, files and announcements |

## Architecture
```
src/lib/supabase.js     – client (null when unconfigured → demo mode)
src/data/mock.js        – demo data + static UI config
src/data/api.js         – Supabase queries/mutations → UI shapes
src/data/AppData.jsx    – provider: auth + data, live-or-demo, exposes actions
src/Login.jsx           – auth screen (live mode only)
supabase/*.sql          – schema, policies, seed
```

## Possible next steps
- **Realtime chat**: `api.subscribeToMessages()` is ready to wire into the
  thread view for instant message delivery.
- **File uploads**: create a `files` storage bucket and upload via
  `supabase.storage` in the Upload action.
- **Per-department budgets**: seed more `finance_budgets` rows.
