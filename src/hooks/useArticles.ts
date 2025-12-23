import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseArticlesOptions {
  status?: 'draft' | 'published' | 'archived';
  articleType?: 'article' | 'update' | 'announcement' | 'event';
  authorId?: string;
  tagSlug?: string;
  featured?: boolean;
  limit?: number;
  searchQuery?: string;
}

export const useArticles = (options: UseArticlesOptions = {}) => {
  const { status = 'published', articleType, authorId, tagSlug, featured, limit = 20, searchQuery } = options;

  return useQuery({
    queryKey: ['articles', options],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select(`
          id,
          slug,
          title,
          excerpt,
          cover_image_url,
          article_type,
          read_time_minutes,
          published_at,
          created_at,
          is_featured,
          author_id,
          profiles:author_id (full_name, email)
        `)
        .eq('status', status)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (articleType) {
        query = query.eq('article_type', articleType);
      }

      if (authorId) {
        query = query.eq('author_id', authorId);
      }

      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Format the data
      const articles = data?.map((a: any) => ({
        ...a,
        author: a.profiles,
      })) || [];

      // If tagSlug is provided, filter by tag
      if (tagSlug && articles.length > 0) {
        const articleIds = articles.map(a => a.id);
        
        const { data: tagData } = await supabase
          .from('article_tags')
          .select(`
            article_id,
            tags:tag_id (slug)
          `)
          .in('article_id', articleIds);

        const filteredIds = tagData
          ?.filter((t: any) => t.tags?.slug === tagSlug)
          .map(t => t.article_id) || [];

        return articles.filter(a => filteredIds.includes(a.id));
      }

      return articles;
    },
  });
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:author_id (full_name, email),
          linked_location:linked_location_id (id, name, slug)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Fetch tags
      const { data: tagData } = await supabase
        .from('article_tags')
        .select(`
          tags:tag_id (id, name, slug)
        `)
        .eq('article_id', data.id);

      // Fetch like count
      const { count: likesCount } = await supabase
        .from('article_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', data.id);

      // Fetch comment count
      const { count: commentsCount } = await supabase
        .from('article_comments')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', data.id);

      return {
        ...data,
        author: (data as any).profiles,
        tags: tagData?.map((t: any) => t.tags) || [],
        _count: {
          likes: likesCount || 0,
          comments: commentsCount || 0,
        },
      };
    },
    enabled: !!slug,
  });
};

export const useMyArticles = () => {
  return useQuery({
    queryKey: ['my-articles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          slug,
          title,
          excerpt,
          cover_image_url,
          article_type,
          status,
          read_time_minutes,
          published_at,
          created_at,
          view_count
        `)
        .eq('author_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data || [];
    },
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });
};
