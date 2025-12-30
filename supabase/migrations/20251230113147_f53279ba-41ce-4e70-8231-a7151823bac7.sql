-- Drop and recreate the view with SECURITY INVOKER (safe default)
DROP VIEW IF EXISTS public.payments_secure;

CREATE VIEW public.payments_secure 
WITH (security_invoker = true)
AS
SELECT 
  id,
  user_id,
  location_id,
  amount,
  currency,
  status,
  payment_type,
  account_type_granted,
  created_at,
  updated_at,
  -- Mask Stripe IDs for non-admin users
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) OR is_master(auth.uid())
    THEN stripe_payment_intent_id 
    ELSE NULL 
  END AS stripe_payment_intent_id,
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) OR is_master(auth.uid())
    THEN stripe_session_id 
    ELSE NULL 
  END AS stripe_session_id
FROM public.payments;

-- Grant access to the view
GRANT SELECT ON public.payments_secure TO authenticated;

-- Add comment
COMMENT ON VIEW public.payments_secure IS 'Secure view of payments that masks Stripe IDs for non-admin users';