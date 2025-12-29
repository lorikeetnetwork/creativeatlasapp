-- Collaborators can manage all events
CREATE POLICY "Collaborators can manage all events"
ON public.events FOR ALL
USING (has_role(auth.uid(), 'collaborator'::app_role));

-- Collaborators can manage all opportunities
CREATE POLICY "Collaborators can manage all opportunities"
ON public.opportunities FOR ALL
USING (has_role(auth.uid(), 'collaborator'::app_role));

-- Collaborators can manage all articles
CREATE POLICY "Collaborators can manage all articles"
ON public.articles FOR ALL
USING (has_role(auth.uid(), 'collaborator'::app_role));

-- Collaborators can view all member profiles
CREATE POLICY "Collaborators can view all member profiles"
ON public.member_profiles FOR SELECT
USING (has_role(auth.uid(), 'collaborator'::app_role));

-- Collaborators can manage all showcases
CREATE POLICY "Collaborators can manage all showcases"
ON public.showcases FOR ALL
USING (has_role(auth.uid(), 'collaborator'::app_role));

-- Collaborators can manage all resources
CREATE POLICY "Collaborators can manage all resources"
ON public.resources FOR ALL
USING (has_role(auth.uid(), 'collaborator'::app_role));

-- Collaborators can view all locations (for linking content)
CREATE POLICY "Collaborators can view all locations"
ON public.locations FOR SELECT
USING (has_role(auth.uid(), 'collaborator'::app_role));