-- Drop the incorrectly scoped policy
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

-- Create a new policy that is ONLY for service_role
-- Note: service_role bypasses RLS by default, but we add this for clarity
-- The key fix is ensuring NO public/authenticated policies exist
CREATE POLICY "Service role only access"
ON public.rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);