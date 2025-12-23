import { useEffect, useState } from 'react';
import { ArticleCard } from './ArticleCard';
import { supabase } from '@/integrations/supabase/client';

interface RelatedArticlesProps {
  currentArticleId: string;
  tagSlugs: string[];
  limit?: number;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  article_type: string;
  read_time_minutes: number | null;
  published_at: string | null;
  created_at: string;
  author?: {
    full_name: string | null;
    email: string;
  } | null;
  tags?: { name: string; slug: string }[];
}

export const RelatedArticles = ({
  currentArticleId,
  tagSlugs,
  limit = 3,
}: RelatedArticlesProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (tagSlugs.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Get article IDs that share the same tags
        const { data: tagData } = await supabase
          .from('article_tags')
          .select(`
            article_id,
            tags:tag_id (slug)
          `)
          .in('tag_id', 
            await supabase
              .from('tags')
              .select('id')
              .in('slug', tagSlugs)
              .then(({ data }) => data?.map(t => t.id) || [])
          );

        const articleIds = [...new Set(
          tagData
            ?.filter(t => t.article_id !== currentArticleId)
            .map(t => t.article_id) || []
        )].slice(0, limit);

        if (articleIds.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch the actual articles
        const { data: articlesData } = await supabase
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
            profiles:author_id (full_name, email)
          `)
          .in('id', articleIds)
          .eq('status', 'published')
          .limit(limit);

        if (articlesData) {
          const formattedArticles = articlesData.map((a: any) => ({
            ...a,
            author: a.profiles,
          }));
          setArticles(formattedArticles);
        }
      } catch (error) {
        console.error('Error fetching related articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [currentArticleId, tagSlugs, limit]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Related Articles</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
