# UPSA Hostel Visitor Management System

A Next.js 14 app for hostel visitor check-in/check-out and package drop-off alerts.
Backend: **Supabase** (PostgreSQL). There is no login — all access goes through the
Next.js API routes, which use the Supabase **service role** key on the server.

## Features

- **Check in** (`/check-in`) – visitor name, phone, who they're visiting, room, purpose, time
- **Check out** (`/check-out`) – pick an active visitor and sign them out
- **Dashboard** (`/dashboard`) – active visitors and visit history
- **Packages** (`/packages`) – register packages, send alert, mark collected
- **My packages** (`/packages/for-me`) – residents look up packages by phone number

## Setup

### 1. Supabase
1. Create a project at https://supabase.com
2. **SQL Editor** → paste and run **`supabase-schema.sql`** (the root one — NOT anything in `supabase/`)
3. **Settings → API** → copy Project URL, anon key and service_role key

### 2. Environment
```bash
cp .env.example .env
```
Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
The service role key is required (API routes fail without it) and must never be committed or exposed to the browser.

### 3. Run
```bash
npm install
npm run dev      # http://localhost:3000
```
Production: `npm run build && npm start`.

## Troubleshooting

- **"Could not find the 'host_name' column" / null value in column "host_id"** – your database has the old
  schema. In the SQL editor run `drop table if exists public.visits, public.packages cascade;`
  then re-run `supabase-schema.sql`.
- **"SUPABASE_SERVICE_ROLE_KEY is required"** – the key is missing from `.env`; restart `npm run dev` after editing.
- **Fonts fail to load at build** – `next/font/google` needs internet access during `npm run build`.

## Notes

- `supabase/schema.legacy-unused.sql` and `npm run db:seed` belong to an earlier auth/roles design and are not used.
- Package alerts: `POST /api/packages/[id]/notify` only records `notified_at`. Add an SMS provider (e.g. Twilio) there to actually send messages.
