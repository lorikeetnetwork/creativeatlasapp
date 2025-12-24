import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type MemberProfileInsert = Database['public']['Tables']['member_profiles']['Insert'];
type MemberProfileUpdate = Database['public']['Tables']['member_profiles']['Update'];
type PortfolioItemInsert = Database['public']['Tables']['member_portfolio_items']['Insert'];
type PortfolioItemUpdate = Database['public']['Tables']['member_portfolio_items']['Update'];

export function useMemberMutations() {
  const queryClient = useQueryClient();

  const createProfile = useMutation({
    mutationFn: async (profile: MemberProfileInsert) => {
      const { data, error } = await supabase
        .from('member_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['current-member-profile'] });
      toast.success('Profile created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create profile: ' + error.message);
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, ...updates }: MemberProfileUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('member_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['member-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['member-profile', data.id] });
      queryClient.invalidateQueries({ queryKey: ['current-member-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    },
  });

  const deleteProfile = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('member_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['current-member-profile'] });
      toast.success('Profile deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete profile: ' + error.message);
    },
  });

  const addPortfolioItem = useMutation({
    mutationFn: async (item: PortfolioItemInsert) => {
      const { data, error } = await supabase
        .from('member_portfolio_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['member-portfolio', data.member_id] });
      toast.success('Portfolio item added');
    },
    onError: (error) => {
      toast.error('Failed to add portfolio item: ' + error.message);
    },
  });

  const updatePortfolioItem = useMutation({
    mutationFn: async ({ id, ...updates }: PortfolioItemUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('member_portfolio_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['member-portfolio', data.member_id] });
      toast.success('Portfolio item updated');
    },
    onError: (error) => {
      toast.error('Failed to update portfolio item: ' + error.message);
    },
  });

  const deletePortfolioItem = useMutation({
    mutationFn: async ({ id, memberId }: { id: string; memberId: string }) => {
      const { error } = await supabase
        .from('member_portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return memberId;
    },
    onSuccess: (memberId) => {
      queryClient.invalidateQueries({ queryKey: ['member-portfolio', memberId] });
      toast.success('Portfolio item removed');
    },
    onError: (error) => {
      toast.error('Failed to remove portfolio item: ' + error.message);
    },
  });

  return {
    createProfile,
    updateProfile,
    deleteProfile,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
  };
}
