-- Create rate limiting trigger for newsletter_subscribers
CREATE OR REPLACE FUNCTION public.check_newsletter_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_count INTEGER;
  max_per_hour INTEGER := 3;
  max_per_day INTEGER := 10;
BEGIN
  -- Validate email length
  IF LENGTH(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email is too long (max 255 characters).';
  END IF;

  -- Basic email validation
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address provided.';
  END IF;

  -- Check hourly limit
  SELECT COUNT(*) INTO recent_count
  FROM newsletter_subscribers
  WHERE email = NEW.email
    AND subscribed_at > NOW() - INTERVAL '1 hour';
  
  IF recent_count >= max_per_hour THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before subscribing again.';
  END IF;
  
  -- Check daily limit
  SELECT COUNT(*) INTO recent_count
  FROM newsletter_subscribers
  WHERE email = NEW.email
    AND subscribed_at > NOW() - INTERVAL '24 hours';
  
  IF recent_count >= max_per_day THEN
    RAISE EXCEPTION 'Daily limit exceeded. Please try again tomorrow.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS check_newsletter_rate_limit_trigger ON public.newsletter_subscribers;
CREATE TRIGGER check_newsletter_rate_limit_trigger
  BEFORE INSERT ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.check_newsletter_rate_limit();

-- Add index for rate limit queries
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email_subscribed 
ON public.newsletter_subscribers(email, subscribed_at);