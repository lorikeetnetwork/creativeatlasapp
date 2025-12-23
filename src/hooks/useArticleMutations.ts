import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateArticleData {
  title: string;
  slug: string;
  excerpt?: string;
  content: any[];
  cover_image_url?: string;
  article_type: 'article' | 'update' | 'announcement' | 'event';
  status: 'draft' | 'published';
  linked_location_id?: string;
  tagIds?: string[];
}

interface UpdateArticleData extends Partial<CreateArticleData> {
  id: string;
}

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateArticleData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { tagIds, ...articleData } = data;

      // Calculate read time based on content length
      const contentText = JSON.stringify(data.content);
      const wordCount = contentText.split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      const insertData = {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt || null,
        content: articleData.content as any,
        cover_image_url: articleData.cover_image_url || null,
        article_type: articleData.article_type,
        status: articleData.status,
        linked_location_id: articleData.linked_location_id || null,
        author_id: user.id,
        read_time_minutes: readTimeMinutes,
        published_at: data.status === 'published' ? new Date().toISOString() : null,
      };

      const { data: article, error } = await supabase
        .from('articles')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Add tags if provided
      if (tagIds && tagIds.length > 0) {
        await supabase
          .from('article_tags')
          .insert(tagIds.map(tagId => ({
            article_id: article.id,
            tag_id: tagId,
          })));
      }

      return article;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      toast({
        title: 'Article created',
        description: 'Your article has been saved',
      });
    },
    onError: (error) => {
      console.error('Error creating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to create article',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, tagIds, ...data }: UpdateArticleData) => {
      const updateData: Record<string, any> = {};
      
      if (data.title) updateData.title = data.title;
      if (data.slug) updateData.slug = data.slug;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.content) updateData.content = data.content;
      if (data.cover_image_url !== undefined) updateData.cover_image_url = data.cover_image_url;
      if (data.article_type) updateData.article_type = data.article_type;
      if (data.status) updateData.status = data.status;
      if (data.linked_location_id !== undefined) updateData.linked_location_id = data.linked_location_id;

      // Calculate read time if content is updated
      if (data.content) {
        const contentText = JSON.stringify(data.content);
        const wordCount = contentText.split(/\s+/).length;
        updateData.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
      }

      if (data.status === 'published') {
        const { data: existing } = await supabase
          .from('articles')
          .select('published_at')
          .eq('id', id)
          .single();
        
        if (!existing?.published_at) {
          updateData.published_at = new Date().toISOString();
        }
      }

      const { data: article, error } = await supabase
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (tagIds !== undefined) {
        await supabase.from('article_tags').delete().eq('article_id', id);
        if (tagIds.length > 0) {
          await supabase.from('article_tags').insert(
            tagIds.map(tagId => ({ article_id: id, tag_id: tagId }))
          );
        }
      }

      return article;
    },
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      queryClient.invalidateQueries({ queryKey: ['article', article.slug] });
      toast({ title: 'Article updated' });
    },
    onError: (error) => {
      console.error('Error updating article:', error);
      toast({ title: 'Error', description: 'Failed to update article', variant: 'destructive' });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['my-articles'] });
      toast({ title: 'Article deleted' });
    },
    onError: (error) => {
      console.error('Error deleting article:', error);
      toast({ title: 'Error', description: 'Failed to delete article', variant: 'destructive' });
    },
  });
};
