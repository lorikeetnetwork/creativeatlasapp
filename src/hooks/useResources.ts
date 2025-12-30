import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ResourceType = Database["public"]["Enums"]["resource_type"];
type LocationCategory = Database["public"]["Enums"]["location_category"];
type ArticleStatus = Database["public"]["Enums"]["article_status"];

export interface ResourceFilters {
  resourceType?: ResourceType | null;
  category?: LocationCategory | null;
  search?: string;
}

export const useResources = (filters?: ResourceFilters) => {
  return useQuery({
    queryKey: ["resources", filters],
    queryFn: async () => {
      let query = supabase
        .from("resources")
        .select(`
          *,
          author:profiles!resources_author_id_fkey(id, full_name, email)
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (filters?.resourceType) {
        query = query.eq("resource_type", filters.resourceType);
      }

      if (filters?.category) {
        query = query.eq("category", filters.category);
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

export const useResource = (slug: string) => {
  return useQuery({
    queryKey: ["resource", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          author:profiles!resources_author_id_fkey(id, full_name, email)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useMyResources = () => {
  return useQuery({
    queryKey: ["my-resources"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useResourceMutations = () => {
  const queryClient = useQueryClient();

  const createResource = useMutation({
    mutationFn: async (resource: {
      title: string;
      slug: string;
      description?: string;
      content?: any;
      cover_image_url?: string;
      resource_type: ResourceType;
      category?: LocationCategory;
      external_url?: string;
      file_url?: string;
      status: ArticleStatus;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("resources")
        .insert({
          ...resource,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["my-resources"] });
      queryClient.invalidateQueries({ queryKey: ["collaborator-resources"] });
    },
  });

  const updateResource = useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      title?: string;
      slug?: string;
      description?: string;
      content?: any;
      cover_image_url?: string;
      resource_type?: ResourceType;
      category?: LocationCategory;
      external_url?: string;
      file_url?: string;
      status?: ArticleStatus;
      is_featured?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("resources")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["my-resources"] });
      queryClient.invalidateQueries({ queryKey: ["collaborator-resources"] });
    },
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["my-resources"] });
      queryClient.invalidateQueries({ queryKey: ["collaborator-resources"] });
    },
  });

  return { createResource, updateResource, deleteResource };
};
