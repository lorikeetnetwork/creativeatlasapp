-- Add file_url column to resources table for direct file downloads
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_url text;