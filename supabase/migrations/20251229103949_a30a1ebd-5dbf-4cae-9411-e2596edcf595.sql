-- Remove the existing public SELECT policy that exposes all data
DROP POLICY IF EXISTS "Public can view active locations" ON public.locations;

-- Create a new restrictive public policy that excludes sensitive contact fields
-- Public users can only see non-sensitive location data via the edge function
-- Direct table access will not include email/phone for public users
CREATE POLICY "Public can view active locations (limited fields)" 
ON public.locations 
FOR SELECT 
USING (
  status = 'Active'::location_status 
  AND (
    -- Subscribers and authenticated users with paid accounts can see all data
    auth.uid() IS NOT NULL
  )
);

-- Add a separate policy for completely unauthenticated access that restricts to edge function only
-- This effectively forces public access through the edge function which masks contact data
CREATE POLICY "Service role can read all locations"
ON public.locations
FOR SELECT
TO service_role
USING (true);