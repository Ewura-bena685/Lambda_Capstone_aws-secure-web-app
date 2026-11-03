-- Visitor Management: visits and packages  (THIS is the schema the app uses)
-- Run in Supabase SQL editor. Safe to re-run.
--
-- If you previously ran supabase/schema.sql (the old schema), the tables have
-- the wrong columns. Uncomment the next line to wipe them and start clean:
-- drop table if exists public.visits, public.packages cascade;
--
-- If you get "Could not find the 'host_name' column" when checking in,
-- run supabase-migration-visits-columns.sql first to add missing columns.

-- Visits: visitor check-in/check-out with room and time
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  visitor_phone text not null,
  host_name text not null,
  room_number text not null,
  purpose text,
  check_in_at timestamptz not null default now(),
  check_out_at timestamptz,
  created_at timestamptz not null default now()
);

-- Add room_number if your visits table already exists without it:
-- alter table public.visits add column if not exists room_number text;
-- update public.visits set room_number = '' where room_number is null;
-- alter table public.visits alter column room_number set not null;

alter table public.visits enable row level security;
drop policy if exists "Service role full access visits" on public.visits;
create policy "Service role full access visits"
  on public.visits for all using (true) with check (true);

-- Packages: left at porters, resident notified, then collected
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  resident_name text not null,
  resident_phone text not null,
  room_number text not null,
  sender_name text not null,
  description text,
  received_at timestamptz not null default now(),
  notified_at timestamptz,
  collected_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.packages enable row level security;
drop policy if exists "Service role full access packages" on public.packages;
create policy "Service role full access packages"
  on public.packages for all using (true) with check (true);
