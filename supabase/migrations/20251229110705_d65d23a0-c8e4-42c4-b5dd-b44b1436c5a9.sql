-- Create a function to check rate limits for contact form submissions
-- This prevents spam/abuse by limiting submissions per email per location
CREATE OR REPLACE FUNCTION public.check_contact_form_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
  max_per_hour INTEGER := 3;  -- Max 3 submissions per email per location per hour
  max_per_day INTEGER := 10;  -- Max 10 submissions per email per location per day
BEGIN
  -- Check hourly limit
  SELECT COUNT(*) INTO recent_count
  FROM contact_form_submissions
  WHERE sender_email = NEW.sender_email
    AND location_id = NEW.location_id
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_count >= max_per_hour THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting another message.';
  END IF;
  
  -- Check daily limit
  SELECT COUNT(*) INTO recent_count
  FROM contact_form_submissions
  WHERE sender_email = NEW.sender_email
    AND location_id = NEW.location_id
    AND created_at > NOW() - INTERVAL '24 hours';
  
  IF recent_count >= max_per_day THEN
    RAISE EXCEPTION 'Daily limit exceeded. Please try again tomorrow.';
  END IF;
  
  -- Basic validation: ensure required fields are not empty/spam-like
  IF LENGTH(TRIM(NEW.sender_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid name provided.';
  END IF;
  
  IF LENGTH(TRIM(NEW.message)) < 10 THEN
    RAISE EXCEPTION 'Message is too short.';
  END IF;
  
  IF NEW.sender_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address provided.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for rate limiting on contact form submissions
DROP TRIGGER IF EXISTS contact_form_rate_limit_trigger ON contact_form_submissions;
CREATE TRIGGER contact_form_rate_limit_trigger
  BEFORE INSERT ON contact_form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_contact_form_rate_limit();

-- Add index for efficient rate limit checks
CREATE INDEX IF NOT EXISTS idx_contact_form_email_location_created 
ON contact_form_submissions(sender_email, location_id, created_at DESC);