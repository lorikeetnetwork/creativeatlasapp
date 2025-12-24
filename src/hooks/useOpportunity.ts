import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOpportunity = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["opportunity", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          poster:profiles!opportunities_poster_id_fkey(id, full_name, email),
          location:locations(id, name, suburb, state, address, logo_url, website)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Increment view count
      await supabase
        .from("opportunities")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

      return data;
    },
    enabled: !!slug,
  });
};

export const useOpportunityById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["opportunity-by-id", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          poster:profiles!opportunities_poster_id_fkey(id, full_name, email),
          location:locations(id, name, suburb, state)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
