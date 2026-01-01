-- Create career stage enum
CREATE TYPE public.career_stage AS ENUM ('emerging', 'mid_career', 'established');

-- Add career_stage column to member_profiles
ALTER TABLE public.member_profiles 
ADD COLUMN career_stage public.career_stage DEFAULT NULL;

-- Add artist-specific disciplines as an array
ALTER TABLE public.member_profiles 
ADD COLUMN artist_disciplines TEXT[] DEFAULT '{}';

-- Add themes/genres/interests tags
ALTER TABLE public.member_profiles 
ADD COLUMN creative_tags TEXT[] DEFAULT '{}';