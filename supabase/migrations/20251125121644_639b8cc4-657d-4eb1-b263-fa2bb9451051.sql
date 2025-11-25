-- Create account type enum
CREATE TYPE account_type AS ENUM ('free', 'basic_paid', 'creative_entity');

-- Add account type columns to profiles table
ALTER TABLE profiles 
ADD COLUMN account_type account_type DEFAULT 'free',
ADD COLUMN payment_verified BOOLEAN DEFAULT false,
ADD COLUMN payment_date TIMESTAMPTZ,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_payment_intent_id TEXT;

-- Index for quick lookups
CREATE INDEX idx_profiles_account_type ON profiles(account_type);

-- Update payments table to track payment types
ALTER TABLE payments
ADD COLUMN payment_type TEXT, -- 'basic_account' or 'creative_listing'
ADD COLUMN account_type_granted account_type;

-- Create business_profiles table
CREATE TABLE business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Extended Details
  tagline TEXT,
  about TEXT,
  specialties TEXT[],
  awards_recognition TEXT[],
  
  -- Current Project
  current_project_title TEXT,
  current_project_description TEXT,
  current_project_image_url TEXT,
  current_project_start_date DATE,
  current_project_end_date DATE,
  current_project_status TEXT DEFAULT 'active',
  
  -- Business Details
  founded_year INTEGER,
  team_size TEXT,
  business_hours JSONB,
  
  -- Metadata
  profile_views INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_profiles
CREATE POLICY "Public can view business profiles"
  ON business_profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = business_profiles.location_id 
    AND locations.status = 'Active'
  ));

CREATE POLICY "Owners can update their business profiles"
  ON business_profiles FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = business_profiles.location_id 
    AND locations.owner_user_id = auth.uid()
  ));

CREATE POLICY "Owners can create their business profiles"
  ON business_profiles FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = business_profiles.location_id 
    AND locations.owner_user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all business profiles"
  ON business_profiles FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create business_videos table
CREATE TABLE business_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  video_platform TEXT,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view videos for active locations"
  ON business_videos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = business_videos.location_id 
    AND locations.status = 'Active'
  ));

CREATE POLICY "Owners can manage their videos"
  ON business_videos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = business_videos.location_id 
    AND locations.owner_user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all videos"
  ON business_videos FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create business_offerings table
CREATE TABLE business_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  price_range TEXT,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_offerings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view offerings for active locations"
  ON business_offerings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = business_offerings.location_id 
    AND locations.status = 'Active'
  ));

CREATE POLICY "Owners can manage their offerings"
  ON business_offerings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = business_offerings.location_id 
    AND locations.owner_user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all offerings"
  ON business_offerings FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Create contact_form_submissions table
CREATE TABLE contact_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE NOT NULL,
  
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT,
  
  status TEXT DEFAULT 'unread',
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their submissions"
  ON contact_form_submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = contact_form_submissions.location_id 
    AND locations.owner_user_id = auth.uid()
  ));

CREATE POLICY "Anyone can submit contact forms"
  ON contact_form_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update submission status"
  ON contact_form_submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = contact_form_submissions.location_id 
    AND locations.owner_user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all submissions"
  ON contact_form_submissions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-offerings', 'business-offerings', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for business-offerings
CREATE POLICY "Public can view offering images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-offerings');

CREATE POLICY "Authenticated users can upload offering images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'business-offerings' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own offering images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'business-offerings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own offering images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'business-offerings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS policies for project-images
CREATE POLICY "Public can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own project images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);