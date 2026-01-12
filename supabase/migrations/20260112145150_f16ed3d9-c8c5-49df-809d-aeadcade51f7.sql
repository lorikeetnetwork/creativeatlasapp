-- Fix the suspicious_contact_access view to use SECURITY INVOKER instead of SECURITY DEFINER
-- This ensures the view respects RLS policies of the calling user

-- Drop the existing view
DROP VIEW IF EXISTS public.suspicious_contact_access;

-- Recreate with SECURITY INVOKER
CREATE VIEW public.suspicious_contact_access
WITH (security_invoker = true)
AS
SELECT 
    cal.user_id,
    p.email AS user_email,
    p.full_name AS user_name,
    cal.location_id,
    l.name AS location_name,
    count(*) AS access_count_24h,
    sum(cal.rows_accessed) AS total_rows_accessed_24h,
    max(cal.accessed_at) AS last_access
FROM contact_form_access_logs cal
JOIN profiles p ON p.id = cal.user_id
JOIN locations l ON l.id = cal.location_id
WHERE cal.accessed_at > (now() - INTERVAL '24 hours')
GROUP BY cal.user_id, p.email, p.full_name, cal.location_id, l.name
HAVING count(*) > 20 OR sum(cal.rows_accessed) > 100
ORDER BY sum(cal.rows_accessed) DESC;

-- Grant appropriate permissions
GRANT SELECT ON public.suspicious_contact_access TO authenticated;