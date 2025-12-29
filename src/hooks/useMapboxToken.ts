import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMapboxToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      // First check environment variable (for local dev)
      const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
      if (envToken) {
        setToken(envToken);
        setLoading(false);
        return;
      }

      // Then check localStorage (user-provided fallback)
      const localToken = localStorage.getItem("mapbox_token");
      if (localToken) {
        setToken(localToken);
        setLoading(false);
        return;
      }

      // Finally, fetch from edge function
      try {
        const { data, error: fnError } = await supabase.functions.invoke("get-mapbox-token");
        
        if (fnError) {
          console.error("Error fetching Mapbox token:", fnError);
          setError("Failed to load map configuration");
          setLoading(false);
          return;
        }

        if (data?.token) {
          setToken(data.token);
          // Cache it in localStorage for subsequent requests
          localStorage.setItem("mapbox_token", data.token);
        } else {
          setError("Map configuration not available");
        }
      } catch (err) {
        console.error("Error fetching Mapbox token:", err);
        setError("Failed to load map configuration");
      }

      setLoading(false);
    }

    fetchToken();
  }, []);

  const saveToken = (newToken: string) => {
    if (newToken.trim()) {
      localStorage.setItem("mapbox_token", newToken.trim());
      setToken(newToken.trim());
      setError(null);
    }
  };

  return { token, loading, error, saveToken };
}
