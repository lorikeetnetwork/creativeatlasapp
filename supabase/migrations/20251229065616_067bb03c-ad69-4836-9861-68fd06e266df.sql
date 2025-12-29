-- Create enum for application status
CREATE TYPE public.collaborator_application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create collaborator_applications table
CREATE TABLE public.collaborator_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  disciplines TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  experience_summary TEXT,
  motivation TEXT NOT NULL,
  contribution_areas TEXT[] DEFAULT '{}',
  hours_per_week TEXT,
  references_info TEXT,
  status public.collaborator_application_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaborator_applications ENABLE ROW LEVEL SECURITY;

-- Users can insert their own applications
CREATE POLICY "Users can submit their own applications"
ON public.collaborator_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
ON public.collaborator_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Collaborators and admins can view all applications
CREATE POLICY "Collaborators can view all applications"
ON public.collaborator_applications
FOR SELECT
USING (has_role(auth.uid(), 'collaborator') OR has_role(auth.uid(), 'admin'));

-- Collaborators and admins can update applications (approve/reject)
CREATE POLICY "Collaborators can update applications"
ON public.collaborator_applications
FOR UPDATE
USING (has_role(auth.uid(), 'collaborator') OR has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_collaborator_applications_updated_at
BEFORE UPDATE ON public.collaborator_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();