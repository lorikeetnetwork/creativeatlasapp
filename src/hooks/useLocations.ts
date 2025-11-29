import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface LocationWithPhotos extends Tables<"locations"> {
  location_photos?: { photo_url: string; display_order: number | null }[];
}

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("locations")
          .select(`
            *,
            location_photos (
              photo_url,
              display_order
            )
          `)
          .eq("status", "Active")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        
        // Sort photos by display_order for each location
        const locationsWithSortedPhotos = (data || []).map(location => ({
          ...location,
          location_photos: location.location_photos?.sort(
            (a, b) => (a.display_order || 0) - (b.display_order || 0)
          )
        }));
        
        setLocations(locationsWithSortedPhotos);
        setError(null);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
};
