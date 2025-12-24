import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MemberProfile = Database['public']['Tables']['member_profiles']['Row'];

interface MemberFilters {
  discipline?: string;
  availableForHire?: boolean;
  availableForCollaboration?: boolean;
  isMentor?: boolean;
  state?: string;
  search?: string;
}

export function useMemberProfiles(filters: MemberFilters = {}) {
  return useQuery({
    queryKey: ['member-profiles', filters],
    queryFn: async () => {
      let query = supabase
        .from('member_profiles')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (filters.discipline) {
        query = query.eq('primary_discipline', filters.discipline as any);
      }

      if (filters.availableForHire) {
        query = query.eq('is_available_for_hire', true);
      }

      if (filters.availableForCollaboration) {
        query = query.eq('is_available_for_collaboration', true);
      }

      if (filters.isMentor) {
        query = query.eq('is_mentor', true);
      }

      if (filters.state) {
        query = query.eq('state', filters.state);
      }

      if (filters.search) {
        query = query.or(`display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MemberProfile[];
    },
  });
}

export function useMemberProfile(id: string) {
  return useQuery({
    queryKey: ['member-profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as MemberProfile;
    },
    enabled: !!id,
  });
}

export function useCurrentUserMemberProfile() {
  return useQuery({
    queryKey: ['current-member-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('member_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as MemberProfile | null;
    },
  });
}

export function useMemberPortfolioItems(memberId: string) {
  return useQuery({
    queryKey: ['member-portfolio', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_portfolio_items')
        .select('*')
        .eq('member_id', memberId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
  });
}
