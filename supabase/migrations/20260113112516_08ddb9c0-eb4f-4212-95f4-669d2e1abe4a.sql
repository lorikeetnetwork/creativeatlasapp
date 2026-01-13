-- Remove the old permissive newsletter subscribe policy
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;

-- Drop our incorrect blocking policy 
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.newsletter_subscribers;

-- Newsletter inserts now happen only via edge function using service role
-- No policy needed - service role bypasses RLS

-- For contact_form_access_logs - restrict to only INSERT via service role in DB functions
-- The current trigger uses SECURITY DEFINER so it can insert
-- Drop the overly permissive policy since the trigger handles it
DROP POLICY IF EXISTS "System can insert access logs" ON public.contact_form_access_logs;

-- rate_limits is fine - service role only is the intended behavior
-- The trigger/function uses SECURITY DEFINER which bypasses RLS