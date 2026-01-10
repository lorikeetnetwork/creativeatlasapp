import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration
const RATE_LIMITS = {
  anonymous: { hourly: 30, perMinute: 10 },
  authenticated: { hourly: 100, perMinute: 15 },
  subscriber: { hourly: 300, perMinute: 30 },
};

interface RateLimitEntry {
  request_count: number;
  window_start: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

function logStep(step: string, details?: Record<string, unknown>) {
  console.log(`[get-locations] ${step}:`, JSON.stringify(details || {}));
}

function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

async function checkRateLimit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseAdmin: SupabaseClient<any, any, any>,
  identifier: string,
  identifierType: 'ip' | 'user',
  limits: { hourly: number; perMinute: number }
): Promise<RateLimitResult> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Check hourly limit - use raw query approach
  const { data, error: hourlyError } = await supabaseAdmin
    .from('rate_limits')
    .select('request_count, window_start')
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .gte('window_start', oneHourAgo.toISOString())
    .maybeSingle();

  const hourlyData = data as RateLimitEntry | null;

  if (hourlyError) {
    logStep('Rate limit check error', { error: hourlyError.message });
    return { allowed: true, remaining: limits.hourly, resetTime: now.getTime() + 3600000, limit: limits.hourly };
  }

  const currentCount = hourlyData?.request_count || 0;
  const windowStart = hourlyData?.window_start ? new Date(hourlyData.window_start) : now;
  const resetTime = new Date(windowStart.getTime() + 60 * 60 * 1000).getTime();

  if (currentCount >= limits.hourly) {
    logStep('Rate limit exceeded', { identifier, identifierType, count: currentCount, limit: limits.hourly });
    return { allowed: false, remaining: 0, resetTime, limit: limits.hourly };
  }

  // Use upsert to prevent race condition with duplicate key errors
  await supabaseAdmin
    .from('rate_limits')
    .upsert({
      identifier,
      identifier_type: identifierType,
      request_count: currentCount + 1,
      window_start: hourlyData?.window_start || now.toISOString(),
    }, {
      onConflict: 'identifier,identifier_type',
      ignoreDuplicates: false
    });

  return {
    allowed: true,
    remaining: limits.hourly - currentCount - 1,
    resetTime,
    limit: limits.hourly,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Request received');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || '' } },
    });

    const { data: { user } } = await supabaseUser.auth.getUser();
    const clientIP = getClientIP(req);

    logStep('Client info', { userId: user?.id, ip: clientIP });

    let limits = RATE_LIMITS.anonymous;
    let identifier = clientIP;
    let identifierType: 'ip' | 'user' = 'ip';
    let isSubscriber = false;

    if (user) {
      identifierType = 'user';
      identifier = user.id;
      
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('account_type, subscription_status')
        .eq('id', user.id)
        .maybeSingle();

      const profileData = profile as { account_type: string | null; subscription_status: string | null } | null;

      if (profileData?.account_type && profileData.account_type !== 'free') {
        limits = RATE_LIMITS.subscriber;
        isSubscriber = true;
      } else {
        limits = RATE_LIMITS.authenticated;
      }

      logStep('User tier', { accountType: profileData?.account_type, isSubscriber });
    }

    const rateLimitResult = await checkRateLimit(supabaseAdmin, identifier, identifierType, limits);

    const rateLimitHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': rateLimitResult.limit.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
    };

    if (!rateLimitResult.allowed) {
      logStep('Rate limit blocked', { identifier, identifierType });
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        { 
          status: 429, 
          headers: {
            ...rateLimitHeaders,
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { data: locations, error: fetchError } = await supabaseAdmin
      .from('locations')
      .select(`
        *,
        location_photos (
          photo_url,
          display_order
        )
      `)
      .eq('status', 'Active')
      .order('created_at', { ascending: false });

    if (fetchError) {
      logStep('Fetch error', { error: fetchError.message });
      throw fetchError;
    }

    interface LocationPhoto {
      photo_url: string;
      display_order: number | null;
    }

    interface Location {
      id: string;
      email: string | null;
      phone: string | null;
      location_photos: LocationPhoto[];
      [key: string]: unknown;
    }

    const processedLocations = ((locations || []) as Location[]).map((location) => {
      const sortedPhotos = location.location_photos?.sort(
        (a: LocationPhoto, b: LocationPhoto) => 
          (a.display_order || 0) - (b.display_order || 0)
      );

      if (!isSubscriber) {
        return {
          ...location,
          email: location.email ? '••••••@••••••' : null,
          phone: location.phone ? '••• ••• •••' : null,
          location_photos: sortedPhotos,
        };
      }

      return {
        ...location,
        location_photos: sortedPhotos,
      };
    });

    logStep('Locations fetched', { count: processedLocations.length, isSubscriber });

    // Periodically cleanup old rate limit entries
    if (Math.random() < 0.01) {
      supabaseAdmin.rpc('cleanup_old_rate_limits');
    }

    return new Response(
      JSON.stringify({ locations: processedLocations, isSubscriber }),
      { status: 200, headers: rateLimitHeaders }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logStep('ERROR', { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: 'Failed to fetch locations' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
