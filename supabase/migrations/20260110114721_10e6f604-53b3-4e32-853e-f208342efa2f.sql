-- Phase 1: Security and Performance Fixes (with proper drops)

-- 1.1 Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Users can only view their own profile data
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Admin/master can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.is_master(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- 1.2 Fix contact_form_submissions
DROP POLICY IF EXISTS "Location owners can view their contact submissions" ON public.contact_form_submissions;
DROP POLICY IF EXISTS "Location owners can view contact submissions" ON public.contact_form_submissions;

CREATE POLICY "Location owners can view their contact submissions"
ON public.contact_form_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.locations 
    WHERE locations.id = contact_form_submissions.location_id 
    AND locations.owner_user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
  OR public.is_master(auth.uid())
);

-- 1.3 Add performance indexes (IF NOT EXISTS handles existing)
CREATE INDEX IF NOT EXISTS idx_locations_status ON public.locations(status);
CREATE INDEX IF NOT EXISTS idx_locations_owner ON public.locations(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier, identifier_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);

-- 1.4 Add unique constraint for rate_limits upsert (drop first if exists)
ALTER TABLE public.rate_limits DROP CONSTRAINT IF EXISTS rate_limits_identifier_type_unique;
ALTER TABLE public.rate_limits 
ADD CONSTRAINT rate_limits_identifier_type_unique 
UNIQUE (identifier, identifier_type);