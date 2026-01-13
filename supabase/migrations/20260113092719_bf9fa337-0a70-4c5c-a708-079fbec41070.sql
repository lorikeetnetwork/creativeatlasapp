-- Phase 2: Create public_profiles view with only non-PII fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  p.id,
  p.full_name,
  p.account_type,
  p.created_at
FROM public.profiles p;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Phase 3: Revoke direct access to sensitive payment columns for non-admins
-- First ensure payments table has proper RLS
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
ON public.payments
FOR SELECT
USING (public.has_role(auth.uid(), 'master'));

-- Phase 4: Tighten newsletter_subscribers policies
-- Remove direct INSERT for anonymous users, route through edge function
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.newsletter_subscribers;

-- Only allow inserts via service role (edge function)
CREATE POLICY "Service role can insert subscriptions"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (false); -- Block direct inserts, use edge function instead

-- Users can only view their own subscription
CREATE POLICY "Users can view own subscription"
ON public.newsletter_subscribers
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()));