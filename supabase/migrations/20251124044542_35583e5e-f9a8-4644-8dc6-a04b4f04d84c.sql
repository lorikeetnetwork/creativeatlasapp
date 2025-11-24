-- Create location_photos table for photo gallery
CREATE TABLE public.location_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_location_photos_location_id ON public.location_photos(location_id);
CREATE INDEX idx_location_photos_display_order ON public.location_photos(location_id, display_order);

-- Enable RLS
ALTER TABLE public.location_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for location_photos
-- Public can view photos for active locations
CREATE POLICY "Public can view photos for active locations"
ON public.location_photos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.locations
    WHERE locations.id = location_photos.location_id
    AND locations.status = 'Active'::location_status
  )
);

-- Owners can insert photos for their locations
CREATE POLICY "Owners can insert photos for their locations"
ON public.location_photos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.locations
    WHERE locations.id = location_photos.location_id
    AND locations.owner_user_id = auth.uid()
  )
);

-- Owners can update their own photos
CREATE POLICY "Owners can update their own photos"
ON public.location_photos
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.locations
    WHERE locations.id = location_photos.location_id
    AND locations.owner_user_id = auth.uid()
  )
);

-- Owners can delete their own photos
CREATE POLICY "Owners can delete their own photos"
ON public.location_photos
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.locations
    WHERE locations.id = location_photos.location_id
    AND locations.owner_user_id = auth.uid()
  )
);

-- Admins can do everything with photos
CREATE POLICY "Admins can view all photos"
ON public.location_photos
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert photos"
ON public.location_photos
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update photos"
ON public.location_photos
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete photos"
ON public.location_photos
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_location_photos_updated_at
BEFORE UPDATE ON public.location_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for location photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('location-photos', 'location-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for location-photos bucket
CREATE POLICY "Public can view location photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'location-photos');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'location-photos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'location-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'location-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can manage all location photos"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'location-photos'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);