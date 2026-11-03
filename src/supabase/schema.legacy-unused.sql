-- NOT USED BY THE APP. Old auth/roles schema. Do not run this; run ../supabase-schema.sql instead.
-- Run this in Supabase Dashboard → SQL Editor after creating your project.
-- Profiles: one per auth user (auth.users). Created by trigger or by app.
-- Types are created only if they don't exist (idempotent).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM (
      'VISITOR', 'RESIDENT', 'PORTER', 'LECTURER', 'STUDENT', 'ADMIN'
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visit_status') THEN
    CREATE TYPE visit_status AS ENUM ('ACTIVE', 'CHECKED_OUT');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
  END IF;
END$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text not null,
  role app_role not null default 'RESIDENT',
  phone text,
  room_no text,
  hostel text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create profile when a new auth user is created (e.g. sign up)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, phone, room_no, hostel)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::app_role, 'RESIDENT'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'room_no',
    new.raw_user_meta_data->>'hostel'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lecturer profile (optional, for lecturers)
create table public.lecturer_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  department text,
  office text,
  slot_minutes int not null default 30
);

create table public.availability_slots (
  id uuid default gen_random_uuid() primary key,
  lecturer_id uuid not null references public.profiles(id) on delete cascade,
  day_of_week int not null,
  start_time text not null,
  end_time text not null,
  created_at timestamptz default now(),
  unique(lecturer_id, day_of_week, start_time)
);

create index idx_availability_lecturer on public.availability_slots(lecturer_id);

-- Visits (hostel visitor check-in/out)
create table public.visits (
  id uuid default gen_random_uuid() primary key,
  visitor_name text not null,
  visitor_phone text not null,
  host_id uuid not null references public.profiles(id) on delete cascade,
  visitor_id uuid references public.profiles(id) on delete set null,
  room_no text not null,
  hostel text not null,
  check_in_at timestamptz default now(),
  check_out_at timestamptz,
  status visit_status not null default 'ACTIVE',
  created_at timestamptz default now()
);

create index idx_visits_host on public.visits(host_id);
create index idx_visits_status on public.visits(status);
create index idx_visits_check_in on public.visits(check_in_at);

-- Packages
create table public.packages (
  id uuid default gen_random_uuid() primary key,
  resident_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null,
  sender_phone text,
  description text,
  room_no text not null,
  hostel text not null,
  collected boolean not null default false,
  collected_at timestamptz,
  notified_at timestamptz,
  created_at timestamptz default now()
);

create index idx_packages_resident on public.packages(resident_id);
create index idx_packages_collected on public.packages(collected);

-- Appointments (lecturer-student)
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  lecturer_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  title text,
  notes text,
  status appointment_status not null default 'CONFIRMED',
  created_at timestamptz default now()
);

create index idx_appointments_lecturer on public.appointments(lecturer_id);
create index idx_appointments_student on public.appointments(student_id);
create index idx_appointments_slot on public.appointments(slot_start);

-- RLS: enable and allow service role / authenticated as needed.
alter table public.profiles enable row level security;
alter table public.lecturer_profiles enable row level security;
alter table public.availability_slots enable row level security;
alter table public.visits enable row level security;
alter table public.packages enable row level security;
alter table public.appointments enable row level security;

-- Profiles: users can read own; anyone can read residents (for check-in dropdown)
create policy "Profiles read" on public.profiles
  for select using (auth.uid() = id or role = 'RESIDENT');

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Lecturer profiles and slots: public read for booking
create policy "Lecturer profiles read" on public.lecturer_profiles for select using (true);
create policy "Availability read" on public.availability_slots for select using (true);

-- Visits: allow insert (check-in), select/update for porters and residents (handled in API with service or anon)
create policy "Visits select" on public.visits for select using (true);
create policy "Visits insert" on public.visits for insert with check (true);
create policy "Visits update" on public.visits for update using (true);

-- Packages: similar
create policy "Packages select" on public.packages for select using (true);
create policy "Packages insert" on public.packages for insert with check (true);
create policy "Packages update" on public.packages for update using (true);

-- Appointments
create policy "Appointments select" on public.appointments for select using (true);
create policy "Appointments insert" on public.appointments for insert with check (true);
create policy "Appointments update" on public.appointments for update using (true);
