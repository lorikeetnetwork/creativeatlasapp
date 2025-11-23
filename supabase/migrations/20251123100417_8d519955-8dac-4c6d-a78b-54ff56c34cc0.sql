-- Create storage bucket for location logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('location-logos', 'location-logos', true);

-- Create RLS policies for location logos bucket
CREATE POLICY "Anyone can view location logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'location-logos');

CREATE POLICY "Authenticated users can upload their own logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'location-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own logos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'location-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own logos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'location-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add logo_url column to locations table
ALTER TABLE public.locations 
ADD COLUMN logo_url TEXT;