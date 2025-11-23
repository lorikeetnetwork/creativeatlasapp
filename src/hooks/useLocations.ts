import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const useLocations = () => {
  const [locations, setLocations] = useState<Tables<"locations">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("locations")
          .select("*")
          .eq("status", "Active")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setLocations(data || []);
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
