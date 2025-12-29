import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserFavorite {
  id: string;
  user_id: string;
  location_id: string;
  created_at: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFavorites = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFavorites([]);
        setFavoriteIds(new Set());
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      setFavorites(data || []);
      setFavoriteIds(new Set(data?.map(f => f.location_id) || []));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchFavorites();
    });

    return () => subscription.unsubscribe();
  }, [fetchFavorites]);

  const isFavorited = useCallback((locationId: string): boolean => {
    return favoriteIds.has(locationId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (locationId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save favorites",
          variant: "destructive"
        });
        return false;
      }

      const isCurrentlyFavorited = favoriteIds.has(locationId);

      if (isCurrentlyFavorited) {
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("location_id", locationId);

        if (error) throw error;

        setFavoriteIds(prev => {
          const next = new Set(prev);
          next.delete(locationId);
          return next;
        });
        setFavorites(prev => prev.filter(f => f.location_id !== locationId));
        
        toast({
          title: "Removed from favorites",
          description: "Location removed from your favorites"
        });
        return false;
      } else {
        const { data, error } = await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, location_id: locationId })
          .select()
          .single();

        if (error) throw error;

        setFavoriteIds(prev => new Set([...prev, locationId]));
        if (data) setFavorites(prev => [...prev, data]);
        
        toast({
          title: "Added to favorites",
          description: "Location saved to your favorites"
        });
        return true;
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
      return favoriteIds.has(locationId);
    }
  }, [favoriteIds, toast]);

  return {
    favorites,
    favoriteIds,
    isLoading,
    isFavorited,
    toggleFavorite,
    refetch: fetchFavorites
  };
}
