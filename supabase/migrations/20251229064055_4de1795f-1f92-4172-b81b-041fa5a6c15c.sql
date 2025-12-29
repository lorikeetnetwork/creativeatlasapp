-- Allow collaborators to view all users for role management
CREATE POLICY "Collaborators can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'collaborator'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Allow collaborators to insert collaborator roles (not admin roles)
CREATE POLICY "Collaborators can grant collaborator role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  (has_role(auth.uid(), 'collaborator'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  AND role = 'collaborator'::app_role
);

-- Allow collaborators to delete collaborator roles (not admin roles)
CREATE POLICY "Collaborators can revoke collaborator role" 
ON public.user_roles 
FOR DELETE 
USING (
  (has_role(auth.uid(), 'collaborator'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  AND role = 'collaborator'::app_role
);