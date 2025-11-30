import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('Fetching OG data for URL:', url);

    // Normalize URL
    let normalizedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = 'https://' + url;
    }

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
