import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ArtistFilters {
  discipline?: string;
  state?: string;
  careerStage?: 'emerging' | 'mid_career' | 'established';
  availableForHire?: boolean;
  availableForCollaboration?: boolean;
  isMentor?: boolean;
  search?: string;
  tag?: string;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useArtistDiscovery(filters: ArtistFilters = {}, shuffleKey: number = 0) {
  return useQuery({
    queryKey: ['artist-discovery', filters, shuffleKey],
    queryFn: async () => {
      let query = supabase
        .from('member_profiles')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      // Filter by discipline (check artist_disciplines array)
      if (filters.discipline) {
        query = query.contains('artist_disciplines', [filters.discipline]);
      }

      // Filter by state
      if (filters.state) {
        query = query.eq('state', filters.state);
      }

      // Filter by career stage
      if (filters.careerStage) {
        query = query.eq('career_stage', filters.careerStage);
      }

      // Filter by availability
      if (filters.availableForHire) {
        query = query.eq('is_available_for_hire', true);
      }

      if (filters.availableForCollaboration) {
        query = query.eq('is_available_for_collaboration', true);
      }

      if (filters.isMentor) {
        query = query.eq('is_mentor', true);
      }

      // Search filter
      if (filters.search) {
        query = query.or(
          `display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%`
        );
      }

      // Filter by tag
      if (filters.tag) {
        query = query.contains('creative_tags', [filters.tag]);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Shuffle results for equitable discovery
      // Using shuffleKey to trigger re-shuffle when user clicks shuffle button
      return shuffleArray(data || []);
    },
  });
}
