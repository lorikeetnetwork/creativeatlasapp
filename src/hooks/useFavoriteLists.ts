import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FavoriteList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface FavoriteListItem {
  id: string;
  list_id: string;
  location_id: string;
  added_at: string;
}

export function useFavoriteLists() {
  const [lists, setLists] = useState<FavoriteList[]>([]);
  const [listItems, setListItems] = useState<FavoriteListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLists = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLists([]);
        setListItems([]);
        setIsLoading(false);
        return;
      }

      const [listsRes, itemsRes] = await Promise.all([
        supabase.from("favorite_lists").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("favorite_list_items").select("*")
      ]);

      if (listsRes.error) throw listsRes.error;
      if (itemsRes.error) throw itemsRes.error;

      setLists(listsRes.data || []);
      setListItems(itemsRes.data || []);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchLists();
    });

    return () => subscription.unsubscribe();
  }, [fetchLists]);

  const createList = useCallback(async (name: string, description?: string): Promise<FavoriteList | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to create lists",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from("favorite_lists")
        .insert({ user_id: user.id, name, description: description || null })
        .select()
        .single();

      if (error) throw error;

      setLists(prev => [...prev, data]);
      toast({
        title: "List created",
        description: `"${name}" has been created`
      });
      return data;
    } catch (error) {
      console.error("Error creating list:", error);
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  const deleteList = useCallback(async (listId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("favorite_lists")
        .delete()
        .eq("id", listId);

      if (error) throw error;

      setLists(prev => prev.filter(l => l.id !== listId));
      setListItems(prev => prev.filter(i => i.list_id !== listId));
      toast({
        title: "List deleted",
        description: "List has been removed"
      });
      return true;
    } catch (error) {
      console.error("Error deleting list:", error);
      toast({
        title: "Error",
        description: "Failed to delete list",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const addToList = useCallback(async (listId: string, locationId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("favorite_list_items")
        .insert({ list_id: listId, location_id: locationId })
        .select()
        .single();

      if (error) throw error;

      setListItems(prev => [...prev, data]);
      return true;
    } catch (error: any) {
      if (error?.code === "23505") {
        toast({
          title: "Already in list",
          description: "This location is already in the list"
        });
      } else {
        console.error("Error adding to list:", error);
        toast({
          title: "Error",
          description: "Failed to add to list",
          variant: "destructive"
        });
      }
      return false;
    }
  }, [toast]);

  const removeFromList = useCallback(async (listId: string, locationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("favorite_list_items")
        .delete()
        .eq("list_id", listId)
        .eq("location_id", locationId);

      if (error) throw error;

      setListItems(prev => prev.filter(i => !(i.list_id === listId && i.location_id === locationId)));
      return true;
    } catch (error) {
      console.error("Error removing from list:", error);
      toast({
        title: "Error",
        description: "Failed to remove from list",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const getListItems = useCallback((listId: string): string[] => {
    return listItems.filter(i => i.list_id === listId).map(i => i.location_id);
  }, [listItems]);

  const isInList = useCallback((listId: string, locationId: string): boolean => {
    return listItems.some(i => i.list_id === listId && i.location_id === locationId);
  }, [listItems]);

  return {
    lists,
    listItems,
    isLoading,
    createList,
    deleteList,
    addToList,
    removeFromList,
    getListItems,
    isInList,
    refetch: fetchLists
  };
}
