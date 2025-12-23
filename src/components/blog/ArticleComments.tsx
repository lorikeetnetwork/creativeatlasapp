import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user?: {
    full_name: string | null;
    email: string;
  };
}

interface ArticleCommentsProps {
  articleId: string;
}

export const ArticleComments = ({ articleId }: ArticleCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('article_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (full_name, email)
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });
      
      if (data) {
        const formattedComments = data.map((c: any) => ({
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          user_id: c.user_id,
          user: c.profiles,
        }));
        setComments(formattedComments);
      }
    };

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    fetchComments();
    checkUser();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('article_comments')
        .insert({
          article_id: articleId,
          user_id: userId,
          content: newComment.trim(),
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (full_name, email)
        `)
        .single();

      if (error) throw error;

      const formattedComment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        user_id: data.user_id,
        user: (data as any).profiles,
      };

      setComments((prev) => [...prev, formattedComment]);
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await supabase
        .from('article_comments')
        .delete()
        .eq('id', commentId);
      
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      
      toast({
        title: "Comment deleted",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {userId ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || !newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Sign in to leave a comment
          </p>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => {
            const authorName = comment.user?.full_name || comment.user?.email?.split('@')[0] || 'Anonymous';
            const authorInitials = authorName.slice(0, 2).toUpperCase();

            return (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{authorName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
                    </span>
                    {comment.user_id === userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}

          {comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleComments;
