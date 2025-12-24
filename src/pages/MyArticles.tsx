import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  PenSquare,
  Eye,
  Edit,
  Trash2,
  Clock,
  Heart,
  MessageCircle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import type { Session } from "@supabase/supabase-js";

const MyArticles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user's articles
  const { data: articles, isLoading } = useQuery({
    queryKey: ["my_articles", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("author_id", session.user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch like counts for each article
  const { data: likeCounts } = useQuery({
    queryKey: ["article_like_counts", articles?.map((a) => a.id)],
    queryFn: async () => {
      if (!articles?.length) return {};
      const counts: Record<string, number> = {};

      for (const article of articles) {
        const { count } = await supabase
          .from("article_likes")
          .select("*", { count: "exact", head: true })
          .eq("article_id", article.id);
        counts[article.id] = count || 0;
      }

      return counts;
    },
    enabled: !!articles?.length,
  });

  // Fetch comment counts for each article
  const { data: commentCounts } = useQuery({
    queryKey: ["article_comment_counts", articles?.map((a) => a.id)],
    queryFn: async () => {
      if (!articles?.length) return {};
      const counts: Record<string, number> = {};

      for (const article of articles) {
        const { count } = await supabase
          .from("article_comments")
          .select("*", { count: "exact", head: true })
          .eq("article_id", article.id);
        counts[article.id] = count || 0;
      }

      return counts;
    },
    enabled: !!articles?.length,
  });

  // Delete article mutation
  const deleteArticle = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_articles"] });
      toast.success("Article deleted");
    },
    onError: (error: any) => {
      toast.error("Failed to delete article: " + error.message);
    },
  });

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    published: "bg-green-500/10 text-green-600 border-green-500/20",
    archived: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              My Articles
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your drafts and published articles
            </p>
          </div>
          <Button
            onClick={() => navigate("/blog/new")}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PenSquare className="h-4 w-4" />
            New Article
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-32 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Articles List */}
        {!isLoading && articles && articles.length > 0 && (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Thumbnail */}
                    {article.cover_image_url ? (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full md:w-32 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full md:w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">
                            {article.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={statusColors[article.status]}
                            >
                              {article.status.charAt(0).toUpperCase() +
                                article.status.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Updated{" "}
                              {format(
                                new Date(article.updated_at),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {article.status === "published" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8"
                            >
                              <Link to={`/blog/${article.slug}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate(`/blog/edit/${article.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Article</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{article.title}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteArticle.mutate(article.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Stats */}
                      {article.status === "published" && (
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {article.view_count || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" />
                            {likeCounts?.[article.id] || 0} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {commentCounts?.[article.id] || 0} comments
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {article.read_time_minutes || 1} min
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!articles || articles.length === 0) && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No articles yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start writing your first article to share with the community.
            </p>
            <Button
              onClick={() => navigate("/blog/new")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Create Your First Article
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyArticles;
