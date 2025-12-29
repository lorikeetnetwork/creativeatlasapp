import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAllEvents() {
  return useQuery({
    queryKey: ['collaborator-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles!events_creator_id_fkey(id, full_name, email),
          location:locations(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAllOpportunities() {
  return useQuery({
    queryKey: ['collaborator-opportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          poster:profiles!opportunities_poster_id_fkey(id, full_name, email),
          location:locations(id, name),
          applications:opportunity_applications(id, status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAllArticles() {
  return useQuery({
    queryKey: ['collaborator-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:profiles!articles_author_id_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAllMemberProfiles() {
  return useQuery({
    queryKey: ['collaborator-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAllShowcases() {
  return useQuery({
    queryKey: ['collaborator-showcases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('showcases')
        .select(`
          *,
          submitter:profiles!showcases_submitted_by_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCollaboratorStats() {
  return useQuery({
    queryKey: ['collaborator-stats'],
    queryFn: async () => {
      const [events, opportunities, articles, members, showcases] = await Promise.all([
        supabase.from('events').select('id, status', { count: 'exact' }),
        supabase.from('opportunities').select('id, status', { count: 'exact' }),
        supabase.from('articles').select('id, status', { count: 'exact' }),
        supabase.from('member_profiles').select('id', { count: 'exact' }),
        supabase.from('showcases').select('id, is_approved', { count: 'exact' }),
      ]);

      const draftEvents = events.data?.filter(e => e.status === 'draft').length ?? 0;
      const publishedEvents = events.data?.filter(e => e.status === 'published').length ?? 0;
      const openOpportunities = opportunities.data?.filter(o => o.status === 'open').length ?? 0;
      const draftArticles = articles.data?.filter(a => a.status === 'draft').length ?? 0;
      const publishedArticles = articles.data?.filter(a => a.status === 'published').length ?? 0;
      const pendingShowcases = showcases.data?.filter(s => !s.is_approved).length ?? 0;

      return {
        totalEvents: events.count ?? 0,
        draftEvents,
        publishedEvents,
        totalOpportunities: opportunities.count ?? 0,
        openOpportunities,
        totalArticles: articles.count ?? 0,
        draftArticles,
        publishedArticles,
        totalMembers: members.count ?? 0,
        totalShowcases: showcases.count ?? 0,
        pendingShowcases,
      };
    },
  });
}
