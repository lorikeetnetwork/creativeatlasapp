import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ArticleLikeButtonProps {
  articleId: string;
  initialLikesCount?: number;
  size?: 'sm' | 'default' | 'lg';
}

export const ArticleLikeButton = ({
  articleId,
  initialLikesCount = 0,
  size = 'default',
}: ArticleLikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndLike = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Check if user has liked this article
        const { data } = await supabase
          .from('article_likes')
          .select('id')
          .eq('article_id', articleId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsLiked(!!data);
      }
    };
    
    checkUserAndLike();
  }, [articleId]);

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like articles",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', userId);
        
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like
        await supabase
          .from('article_likes')
          .insert({ article_id: articleId, user_id: userId });
        
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "gap-2",
        isLiked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart
        className={cn(
          iconSize,
          "transition-all",
          isLiked && "fill-current"
        )}
      />
      <span>{likesCount}</span>
    </Button>
  );
};

export default ArticleLikeButton;
