import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useEvent = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          creator:profiles!events_creator_id_fkey(id, full_name, email),
          location:locations(id, name, suburb, state, address, latitude, longitude),
          rsvps:event_rsvps(id, user_id, status)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from("events")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

      return data;
    },
    enabled: !!slug,
  });
};

export const useEventById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["event-by-id", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          creator:profiles!events_creator_id_fkey(id, full_name, email),
          location:locations(id, name, suburb, state, address)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
