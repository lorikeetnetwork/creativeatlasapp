-- Add show_location column to member_profiles for privacy control
ALTER TABLE public.member_profiles 
ADD COLUMN show_location boolean DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN public.member_profiles.show_location IS 'Controls whether suburb/state are displayed publicly on the member profile';