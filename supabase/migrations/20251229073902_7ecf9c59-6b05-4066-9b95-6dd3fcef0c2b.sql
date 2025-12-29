-- Add columns to profiles table for password change requirement and magic link invites
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS must_change_password boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS invite_token text,
ADD COLUMN IF NOT EXISTS invite_token_expires_at timestamp with time zone;

-- Index for quick invite token lookup
CREATE INDEX IF NOT EXISTS idx_profiles_invite_token 
ON public.profiles(invite_token) WHERE invite_token IS NOT NULL;