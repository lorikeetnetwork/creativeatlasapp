import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SSRF Protection: Check if hostname is a private/reserved IP
function isPrivateOrReservedIP(hostname: string): boolean {
  // IPv4 pattern
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  
  if (!match) return false;
  
  const parts = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
  
  // Validate each octet is within range
  if (parts.some(p => p > 255)) return false;
  
  // 10.0.0.0/8 - Private
  if (parts[0] === 10) return true;
  
  // 172.16.0.0/12 - Private
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  
  // 192.168.0.0/16 - Private
  if (parts[0] === 192 && parts[1] === 168) return true;
  
  // 127.0.0.0/8 - Loopback
  if (parts[0] === 127) return true;
  
  // 169.254.0.0/16 - Link-local (includes cloud metadata)
  if (parts[0] === 169 && parts[1] === 254) return true;
  
  // 0.0.0.0/8 - Current network
  if (parts[0] === 0) return true;
  
  // 100.64.0.0/10 - Carrier-grade NAT
  if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
  
  // 192.0.0.0/24 - IETF Protocol Assignments
  if (parts[0] === 192 && parts[1] === 0 && parts[2] === 0) return true;
  
  // 192.0.2.0/24 - TEST-NET-1
  if (parts[0] === 192 && parts[1] === 0 && parts[2] === 2) return true;
  
  // 198.51.100.0/24 - TEST-NET-2
  if (parts[0] === 198 && parts[1] === 51 && parts[2] === 100) return true;
  
  // 203.0.113.0/24 - TEST-NET-3
  if (parts[0] === 203 && parts[1] === 0 && parts[2] === 113) return true;
  
  return false;
}

// SSRF Protection: Validate URL before fetching
function validateUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(urlString);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }
    
    const hostname = parsed.hostname.toLowerCase();
    
    // Block localhost variants
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return { valid: false, error: 'Localhost URLs are not allowed' };
    }
    
    // Block IPv6 localhost
    if (hostname.startsWith('[::1]') || hostname.includes('::ffff:127')) {
      return { valid: false, error: 'Localhost URLs are not allowed' };
    }
    
    // Block private/reserved IPs
    if (isPrivateOrReservedIP(hostname)) {
      return { valid: false, error: 'Private IP addresses are not allowed' };
    }
    
    // Block internal/local domains
    const blockedSuffixes = ['.local', '.internal', '.localhost', '.localdomain'];
    if (blockedSuffixes.some(suffix => hostname.endsWith(suffix))) {
      return { valid: false, error: 'Internal domain names are not allowed' };
    }
    
    // Block cloud metadata endpoints
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
      return { valid: false, error: 'Cloud metadata endpoints are not allowed' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

function isValidImageUrl(url: string): boolean {
  // Filter out tracking pixels, analytics, and invalid images
  const invalidPatterns = [
    /facebook\.com\/tr/i,
    /google-analytics\.com/i,
    /googletagmanager\.com/i,
    /pixel\./i,
    /tracking/i,
    /beacon/i,
    /analytics/i,
    /\.gif\?/i, // Tracking pixels often use .gif with query params
    /1x1/i,
    /spacer/i,
  ];
  
  return !invalidPatterns.some(pattern => pattern.test(url));
}

function extractOgImage(html: string, baseUrl: string): string | null {
  // Try og:image first
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  
  if (ogImageMatch?.[1]) {
    const resolved = resolveUrl(ogImageMatch[1], baseUrl);
    if (isValidImageUrl(resolved)) {
      return resolved;
    }
  }

  // Try twitter:image
  const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
  
  if (twitterImageMatch?.[1]) {
    const resolved = resolveUrl(twitterImageMatch[1], baseUrl);
    if (isValidImageUrl(resolved)) {
      return resolved;
    }
  }

  // Try first valid img tag as last resort (skip tiny images and tracking pixels)
  const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
  for (const match of imgMatches) {
    if (match[1]) {
      const resolved = resolveUrl(match[1], baseUrl);
      if (isValidImageUrl(resolved)) {
        return resolved;
      }
    }
  }

  return null;
}

function extractOgDescription(html: string): string | null {
  // Try og:description first
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  
  if (ogDescMatch?.[1]) {
    return decodeHtmlEntities(ogDescMatch[1].trim());
  }

  // Try twitter:description
  const twitterDescMatch = html.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:description["']/i);
  
  if (twitterDescMatch?.[1]) {
    return decodeHtmlEntities(twitterDescMatch[1].trim());
  }

  // Try standard meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  
  if (metaDescMatch?.[1]) {
    return decodeHtmlEntities(metaDescMatch[1].trim());
  }

  return null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function resolveUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  if (url.startsWith('/')) {
    const urlObj = new URL(baseUrl);
    return urlObj.origin + url;
  }
  return new URL(url, baseUrl).href;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize URL
    let normalizedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = 'https://' + url;
    }

    // SSRF Protection: Validate URL before fetching
    const validation = validateUrl(normalizedUrl);
    if (!validation.valid) {
      console.warn('SSRF attempt blocked:', normalizedUrl, validation.error);
      return new Response(
        JSON.stringify({ error: 'Invalid or restricted URL', ogImage: null, ogDescription: null }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching OG data for URL:', normalizedUrl);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let response;
    try {
      response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      const errorMsg = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      console.error('Fetch error for URL:', normalizedUrl, errorMsg);
      // Return null gracefully instead of error - TLS issues are common
      return new Response(
        JSON.stringify({ ogImage: null, ogDescription: null, error: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Failed to fetch URL:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ ogImage: null, ogDescription: null, error: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();
    const ogImage = extractOgImage(html, normalizedUrl);
    const ogDescription = extractOgDescription(html);

    console.log('Extracted OG image:', ogImage);
    console.log('Extracted OG description:', ogDescription?.substring(0, 100));

    return new Response(
      JSON.stringify({ ogImage, ogDescription }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching OG data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ ogImage: null, ogDescription: null, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
