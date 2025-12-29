-- Assign master role to samchiltonmusicbusiness@gmail.com (d81c0070-e809-43d4-a9d4-d51e32c572b0)
INSERT INTO public.user_roles (user_id, role)
VALUES ('d81c0070-e809-43d4-a9d4-d51e32c572b0', 'master')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create is_master security definer function
CREATE OR REPLACE FUNCTION public.is_master(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'master'
  )
$$;

-- Update user_roles policies: Only master can grant/revoke roles
DROP POLICY IF EXISTS "Collaborators can grant collaborator role" ON public.user_roles;
DROP POLICY IF EXISTS "Collaborators can revoke collaborator role" ON public.user_roles;

CREATE POLICY "Master can grant roles"
ON public.user_roles
FOR INSERT
WITH CHECK (is_master(auth.uid()));

CREATE POLICY "Master can revoke roles"
ON public.user_roles
FOR DELETE
USING (is_master(auth.uid()) AND role != 'master');

-- Update collaborator_applications policies: Only master can view/update
DROP POLICY IF EXISTS "Collaborators can view all applications" ON public.collaborator_applications;
DROP POLICY IF EXISTS "Collaborators can update applications" ON public.collaborator_applications;

CREATE POLICY "Master can view all applications"
ON public.collaborator_applications
FOR SELECT
USING (is_master(auth.uid()));

CREATE POLICY "Master can update applications"
ON public.collaborator_applications
FOR UPDATE
USING (is_master(auth.uid()));