import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

interface LocationWithPhotos extends Tables<"locations"> {
  location_photos?: { photo_url: string; display_order: number | null }[];
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        const { data, error: invokeError } = await supabase.functions.invoke('get-locations');

        // Check if component unmounted during fetch
        if (!isMounted) return;

        if (invokeError) {
          // Check for rate limit error (429)
          if (invokeError.message?.includes('429') || invokeError.message?.includes('Too many requests')) {
            toast({
              title: "Slow down!",
              description: "Too many requests. Please wait a moment before refreshing.",
              variant: "destructive",
            });
            setError("Rate limited. Please wait before trying again.");
            return;
          }
          throw invokeError;
        }

        if (!data) {
          throw new Error("No data received");
        }

        // Parse rate limit headers if available
        if (data.rateLimitInfo) {
          setRateLimitInfo(data.rateLimitInfo);
        }

        const nextLocations = data.locations || [];
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.debug("[useLocations] sample coords", nextLocations.slice(0, 5).map((l: any) => ({
            id: l.id,
            name: l.name,
            latitude: l.latitude,
            longitude: l.longitude,
          })));
        }

        setLocations(nextLocations);
        setIsSubscriber(data.isSubscriber || false);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching locations:", err);
        setError("Failed to load locations");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  return { locations, loading, error, isSubscriber, rateLimitInfo };
};
