-- Recreate the public locations policy with correct enum value
DROP POLICY IF EXISTS "Public can view active locations basic info" ON public.locations;

CREATE POLICY "Public can view active locations basic info"
ON public.locations
FOR SELECT
USING (status = 'Active'::location_status);