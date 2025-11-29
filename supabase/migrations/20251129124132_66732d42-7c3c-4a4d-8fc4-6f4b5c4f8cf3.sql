-- Add og_image_url column to store fetched Open Graph images
ALTER TABLE public.locations 
ADD COLUMN og_image_url TEXT;