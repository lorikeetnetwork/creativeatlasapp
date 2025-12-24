import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type EventType = Database["public"]["Enums"]["event_type"];
type EventStatus = Database["public"]["Enums"]["event_status"];
type LocationCategory = Database["public"]["Enums"]["location_category"];

export interface EventFilters {
  eventType?: EventType | null;
  category?: LocationCategory | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isOnline?: boolean | null;
  isFree?: boolean | null;
  search?: string;
}

export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select(`
          *,
          creator:profiles!events_creator_id_fkey(id, full_name, email),
          location:locations(id, name, suburb, state),
          rsvps:event_rsvps(id, user_id, status)
        `)
        .eq("status", "published")
        .gte("start_date", new Date().toISOString().split("T")[0])
        .order("start_date", { ascending: true });

      if (filters?.eventType) {
        query = query.eq("event_type", filters.eventType);
      }

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.startDate) {
        query = query.gte("start_date", filters.startDate.toISOString().split("T")[0]);
      }

      if (filters?.endDate) {
        query = query.lte("start_date", filters.endDate.toISOString().split("T")[0]);
      }

      if (filters?.isOnline !== null && filters?.isOnline !== undefined) {
        query = query.eq("is_online", filters.isOnline);
      }

      if (filters?.isFree !== null && filters?.isFree !== undefined) {
        query = query.eq("is_free", filters.isFree);
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

export const useMyEvents = () => {
  return useQuery({
    queryKey: ["my-events"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          location:locations(id, name, suburb, state),
          rsvps:event_rsvps(id, user_id, status)
        `)
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useMyRSVPs = () => {
  return useQuery({
    queryKey: ["my-rsvps"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("event_rsvps")
        .select(`
          *,
          event:events(
            *,
            creator:profiles!events_creator_id_fkey(id, full_name),
            location:locations(id, name, suburb, state)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
