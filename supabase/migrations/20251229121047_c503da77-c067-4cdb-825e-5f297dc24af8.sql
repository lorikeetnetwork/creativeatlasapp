-- Add maximum length constraints to contact_form_submissions table
ALTER TABLE public.contact_form_submissions
  ADD CONSTRAINT contact_form_sender_name_max_length CHECK (length(sender_name) <= 100),
  ADD CONSTRAINT contact_form_sender_email_max_length CHECK (length(sender_email) <= 255),
  ADD CONSTRAINT contact_form_sender_phone_max_length CHECK (length(sender_phone) <= 30),
  ADD CONSTRAINT contact_form_subject_max_length CHECK (length(subject) <= 200),
  ADD CONSTRAINT contact_form_message_max_length CHECK (length(message) <= 5000),
  ADD CONSTRAINT contact_form_inquiry_type_max_length CHECK (length(inquiry_type) <= 50);

-- Update the rate limit trigger to also validate max lengths
CREATE OR REPLACE FUNCTION public.check_contact_form_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  recent_count INTEGER;
  max_per_hour INTEGER := 3;
  max_per_day INTEGER := 10;
BEGIN
  -- Validate max lengths (defense in depth)
  IF LENGTH(NEW.sender_name) > 100 THEN
    RAISE EXCEPTION 'Name is too long (max 100 characters).';
  END IF;
  
  IF LENGTH(NEW.sender_email) > 255 THEN
    RAISE EXCEPTION 'Email is too long (max 255 characters).';
  END IF;
  
  IF NEW.sender_phone IS NOT NULL AND LENGTH(NEW.sender_phone) > 30 THEN
    RAISE EXCEPTION 'Phone number is too long (max 30 characters).';
  END IF;
  
  IF NEW.subject IS NOT NULL AND LENGTH(NEW.subject) > 200 THEN
    RAISE EXCEPTION 'Subject is too long (max 200 characters).';
  END IF;
  
  IF LENGTH(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Message is too long (max 5000 characters).';
  END IF;

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
$function$;