import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type OpportunityType = Database["public"]["Enums"]["opportunity_type"];
type CompensationType = Database["public"]["Enums"]["compensation_type"];
type ExperienceLevel = Database["public"]["Enums"]["experience_level"];
type LocationCategory = Database["public"]["Enums"]["location_category"];

export interface OpportunityFilters {
  opportunityType?: OpportunityType | null;
  category?: LocationCategory | null;
  compensationType?: CompensationType | null;
  experienceLevel?: ExperienceLevel | null;
  isRemote?: boolean | null;
  search?: string;
}

export const useOpportunities = (filters?: OpportunityFilters) => {
  return useQuery({
    queryKey: ["opportunities", filters],
    queryFn: async () => {
      let query = supabase
        .from("opportunities")
        .select(`
          *,
          poster:profiles!opportunities_poster_id_fkey(id, full_name, email),
          location:locations(id, name, suburb, state, logo_url)
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (filters?.opportunityType) {
        query = query.eq("opportunity_type", filters.opportunityType);
      }

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.compensationType) {
        query = query.eq("compensation_type", filters.compensationType);
      }

      if (filters?.experienceLevel) {
        query = query.eq("experience_level", filters.experienceLevel);
      }

      if (filters?.isRemote === true) {
        query = query.eq("is_remote", true);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export const useMyOpportunities = () => {
  return useQuery({
    queryKey: ["my-opportunities"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          location:locations(id, name, suburb, state),
          applications:opportunity_applications(id, status)
        `)
        .eq("poster_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useSavedOpportunities = () => {
  return useQuery({
    queryKey: ["saved-opportunities"],
    queryFn: async () => {
      // For now, return empty - could implement bookmarks later
      return [];
    },
  });
};
