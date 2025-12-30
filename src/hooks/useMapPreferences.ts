import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MapStyle = "dark" | "light" | "satellite" | "streets" | "outdoors" | "blueprint" | "3d";
export type MarkerColorMode = "category" | "mono" | "highContrast";

export interface MapPreferences {
  map_style: MapStyle;
  marker_color_mode: MarkerColorMode;
  show_favorites_only: boolean;
  default_zoom: number;
  default_center_lat: number | null;
  default_center_lng: number | null;
}

const DEFAULT_PREFERENCES: MapPreferences = {
  map_style: "dark",
  marker_color_mode: "category",
  show_favorites_only: false,
  default_zoom: 8,
  default_center_lat: null,
  default_center_lng: null,
};

export function useMapPreferences() {
  const [preferences, setPreferences] = useState<MapPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPreferences(DEFAULT_PREFERENCES);
        setUserId(null);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("user_map_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          map_style: data.map_style as MapStyle,
          marker_color_mode: data.marker_color_mode as MarkerColorMode,
          show_favorites_only: data.show_favorites_only,
          default_zoom: data.default_zoom,
          default_center_lat: data.default_center_lat,
          default_center_lng: data.default_center_lng,
        });
      }
    } catch (error) {
      console.error("Error fetching map preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchPreferences();
    });

    return () => subscription.unsubscribe();
  }, [fetchPreferences]);

  const updatePreference = useCallback(async <K extends keyof MapPreferences>(
    key: K,
    value: MapPreferences[K]
  ): Promise<boolean> => {
    if (!userId) return false;

    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);

    try {
      const { error } = await supabase
        .from("user_map_preferences")
        .upsert({
          user_id: userId,
          [key]: value,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating preference:", error);
      setPreferences(preferences);
      return false;
    }
  }, [userId, preferences]);

  const updateMapStyle = useCallback((style: MapStyle) => {
    return updatePreference("map_style", style);
  }, [updatePreference]);

  const updateMarkerColorMode = useCallback((mode: MarkerColorMode) => {
    return updatePreference("marker_color_mode", mode);
  }, [updatePreference]);

  const toggleShowFavoritesOnly = useCallback(() => {
    return updatePreference("show_favorites_only", !preferences.show_favorites_only);
  }, [updatePreference, preferences.show_favorites_only]);

  const saveDefaultView = useCallback(async (zoom: number, lat: number, lng: number) => {
    if (!userId) return false;

    const newPrefs = {
      ...preferences,
      default_zoom: zoom,
      default_center_lat: lat,
      default_center_lng: lng,
    };
    setPreferences(newPrefs);

    try {
      const { error } = await supabase
        .from("user_map_preferences")
        .upsert({
          user_id: userId,
          default_zoom: zoom,
          default_center_lat: lat,
          default_center_lng: lng,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error saving default view:", error);
      return false;
    }
  }, [userId, preferences]);

  return {
    preferences,
    isLoading,
    updateMapStyle,
    updateMarkerColorMode,
    toggleShowFavoritesOnly,
    saveDefaultView,
  };
}
