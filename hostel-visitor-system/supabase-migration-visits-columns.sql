-- RUN ONLY THIS FILE in Supabase SQL Editor.
-- Do not run this together with other scripts (the "app_role already exists"
-- error comes from another script – run only the 8 lines below).

-- Adds host_name and room_number to visits if missing.

ALTER TABLE public.visits ADD COLUMN IF NOT EXISTS host_name text;
UPDATE public.visits SET host_name = '' WHERE host_name IS NULL;
ALTER TABLE public.visits ALTER COLUMN host_name SET NOT NULL;
ALTER TABLE public.visits ALTER COLUMN host_name SET DEFAULT '';

ALTER TABLE public.visits ADD COLUMN IF NOT EXISTS room_number text;
UPDATE public.visits SET room_number = '' WHERE room_number IS NULL;
ALTER TABLE public.visits ALTER COLUMN room_number SET NOT NULL;
ALTER TABLE public.visits ALTER COLUMN room_number SET DEFAULT '';
