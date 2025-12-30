import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type LocationCategory = Database["public"]["Enums"]["location_category"];

export interface ShowcaseFilters {
  category?: LocationCategory | null;
  search?: string;
  tags?: string[];
}

export const useShowcases = (filters?: ShowcaseFilters) => {
  return useQuery({
    queryKey: ["showcases", filters],
    queryFn: async () => {
      let query = supabase
        .from("showcases")
        .select(`
          *,
          submitter:profiles!showcases_submitted_by_fkey(id, full_name, email),
          location:locations!showcases_linked_location_id_fkey(id, name, suburb, state)
        `)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.search) {
        query = query.or(`project_title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export const useShowcase = (slug: string) => {
  return useQuery({
    queryKey: ["showcase", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("showcases")
        .select(`
          *,
          submitter:profiles!showcases_submitted_by_fkey(id, full_name, email),
          location:locations!showcases_linked_location_id_fkey(id, name, suburb, state, logo_url)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useMyShowcases = () => {
  return useQuery({
    queryKey: ["my-showcases"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("showcases")
        .select("*")
        .eq("submitted_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useShowcaseMutations = () => {
  const queryClient = useQueryClient();

  const createShowcase = useMutation({
    mutationFn: async (showcase: {
      project_title: string;
      slug: string;
      description: string;
      cover_image_url?: string;
      gallery_images?: string[];
      video_url?: string;
      project_url?: string;
      category?: LocationCategory;
      tags?: string[];
      collaborators?: string;
      linked_location_id?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("showcases")
        .insert({
          ...showcase,
          submitted_by: user.id,
          is_approved: false, // Requires approval
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      queryClient.invalidateQueries({ queryKey: ["my-showcases"] });
      queryClient.invalidateQueries({ queryKey: ["collaborator-showcases"] });
    },
  });

  const updateShowcase = useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      project_title?: string;
      slug?: string;
      description?: string;
      cover_image_url?: string;
      gallery_images?: string[];
      video_url?: string;
      project_url?: string;
      category?: LocationCategory;
      tags?: string[];
      collaborators?: string;
      linked_location_id?: string;
      is_featured?: boolean;
      is_approved?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("showcases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      queryClient.invalidateQueries({ queryKey: ["my-showcases"] });
      queryClient.invalidateQueries({ queryKey: ["collaborator-showcases"] });
    },
  });

  const deleteShowcase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("showcases")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      queryClient.invalidateQueries({ queryKey: ["my-showcases"] });
      queryClient.invalidateQueries({ queryKey: ["collaborator-showcases"] });
    },
  });

  return { createShowcase, updateShowcase, deleteShowcase };
};
