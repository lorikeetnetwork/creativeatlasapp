import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type RSVPStatus = "going" | "interested" | "not_going";

export const useEventRSVP = (eventId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: currentRSVP, isLoading } = useQuery({
    queryKey: ["event-rsvp", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("event_rsvps")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  const setRSVP = useMutation({
    mutationFn: async (status: RSVPStatus) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      if (!eventId) throw new Error("No event ID");

      // Check if RSVP exists
      const { data: existing } = await supabase
        .from("event_rsvps")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing RSVP
        const { data, error } = await supabase
          .from("event_rsvps")
          .update({ status })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new RSVP
        const { data, error } = await supabase
          .from("event_rsvps")
          .insert({
            event_id: eventId,
            user_id: user.id,
            status,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ["event-rsvp", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-rsvps"] });
      
      const messages: Record<RSVPStatus, string> = {
        going: "You're going to this event!",
        interested: "You've marked interest in this event.",
        not_going: "RSVP updated.",
      };
      
      toast({
        title: "RSVP Updated",
        description: messages[status],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeRSVP = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      if (!eventId) throw new Error("No event ID");

      const { error } = await supabase
        .from("event_rsvps")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-rsvp", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["my-rsvps"] });
      toast({
        title: "RSVP Removed",
        description: "You've removed your RSVP.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    currentRSVP,
    isLoading,
    setRSVP: setRSVP.mutate,
    removeRSVP: removeRSVP.mutate,
    isUpdating: setRSVP.isPending || removeRSVP.isPending,
  };
};

export const useEventRSVPCounts = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ["event-rsvp-counts", eventId],
    queryFn: async () => {
      if (!eventId) return { going: 0, interested: 0 };

      const { data, error } = await supabase
        .from("event_rsvps")
        .select("status")
        .eq("event_id", eventId);

      if (error) throw error;

      const counts = { going: 0, interested: 0 };
      data?.forEach((rsvp) => {
        if (rsvp.status === "going") counts.going++;
        if (rsvp.status === "interested") counts.interested++;
      });

      return counts;
    },
    enabled: !!eventId,
  });
};
