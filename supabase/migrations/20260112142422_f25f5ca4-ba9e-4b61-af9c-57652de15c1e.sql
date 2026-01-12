-- Create audit log table for contact form access
CREATE TABLE public.contact_form_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_id UUID NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rows_accessed INTEGER NOT NULL DEFAULT 0,
  access_type TEXT NOT NULL DEFAULT 'view', -- 'view', 'export', 'list'
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.contact_form_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view access logs
CREATE POLICY "Admins can view access logs"
ON public.contact_form_access_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'master')
  )
);

-- System can insert logs (via service role)
CREATE POLICY "System can insert access logs"
ON public.contact_form_access_logs
FOR INSERT
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX idx_contact_form_access_logs_user_location 
ON public.contact_form_access_logs(user_id, location_id, accessed_at DESC);

CREATE INDEX idx_contact_form_access_logs_accessed_at 
ON public.contact_form_access_logs(accessed_at DESC);

-- Create function to log and retrieve contact submissions (with rate limit check)
CREATE OR REPLACE FUNCTION public.get_contact_submissions_logged(
  p_location_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  location_id UUID,
  sender_name TEXT,
  sender_email TEXT,
  sender_phone TEXT,
  subject TEXT,
  message TEXT,
  inquiry_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_access_count INTEGER;
  v_max_hourly_access INTEGER := 100;
  v_row_count INTEGER;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if user is owner of location or admin
  IF NOT EXISTS (
    SELECT 1 FROM locations l
    WHERE l.id = p_location_id
    AND (l.owner_user_id = v_user_id OR EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = v_user_id
      AND ur.role IN ('admin', 'master')
    ))
  ) THEN
    RAISE EXCEPTION 'Access denied: not authorized to view this location''s submissions';
  END IF;
  
  -- Check access rate (hourly limit)
  SELECT COUNT(*) INTO v_access_count
  FROM contact_form_access_logs cal
  WHERE cal.user_id = v_user_id
  AND cal.location_id = p_location_id
  AND cal.accessed_at > NOW() - INTERVAL '1 hour';
  
  IF v_access_count >= v_max_hourly_access THEN
    RAISE EXCEPTION 'Access rate limit exceeded. Please try again later.';
  END IF;
  
  -- Enforce maximum limit
  IF p_limit > 50 THEN
    p_limit := 50;
  END IF;
  
  -- Count rows that will be returned
  SELECT COUNT(*) INTO v_row_count
  FROM contact_form_submissions cfs
  WHERE cfs.location_id = p_location_id
  LIMIT p_limit OFFSET p_offset;
  
  -- Log this access
  INSERT INTO contact_form_access_logs (user_id, location_id, rows_accessed, access_type)
  VALUES (v_user_id, p_location_id, LEAST(v_row_count, p_limit), 'list');
  
  -- Return the data
  RETURN QUERY
  SELECT 
    cfs.id,
    cfs.location_id,
    cfs.sender_name,
    cfs.sender_email,
    cfs.sender_phone,
    cfs.subject,
    cfs.message,
    cfs.inquiry_type,
    cfs.status,
    cfs.created_at,
    cfs.read_at,
    cfs.replied_at
  FROM contact_form_submissions cfs
  WHERE cfs.location_id = p_location_id
  ORDER BY cfs.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Create monitoring view for suspicious access patterns
CREATE OR REPLACE VIEW public.suspicious_contact_access AS
SELECT 
  cal.user_id,
  p.email as user_email,
  p.full_name as user_name,
  cal.location_id,
  l.name as location_name,
  COUNT(*) as access_count_24h,
  SUM(cal.rows_accessed) as total_rows_accessed_24h,
  MAX(cal.accessed_at) as last_access
FROM contact_form_access_logs cal
JOIN profiles p ON p.id = cal.user_id
JOIN locations l ON l.id = cal.location_id
WHERE cal.accessed_at > NOW() - INTERVAL '24 hours'
GROUP BY cal.user_id, p.email, p.full_name, cal.location_id, l.name
HAVING COUNT(*) > 20 OR SUM(cal.rows_accessed) > 100
ORDER BY total_rows_accessed_24h DESC;