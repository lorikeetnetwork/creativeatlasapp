import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { PlateRenderer } from "@/components/blog/PlateRenderer";
import { ArticleLikeButton } from "@/components/blog/ArticleLikeButton";
import { ArticleComments } from "@/components/blog/ArticleComments";
import { AuthorBadge } from "@/components/blog/AuthorBadge";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { ArticleTags } from "@/components/blog/ArticleTags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, Eye, MapPin } from "lucide-react";
import { format } from "date-fns";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch article by slug
  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            email
          ),
          locations:linked_location_id (
            id,
            name,
            suburb,
            state
          )
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch article tags
  const { data: articleTagsData } = useQuery({
    queryKey: ["article_tags", article?.id],
    queryFn: async () => {
      if (!article?.id) return [];
      const { data, error } = await supabase
        .from("article_tags")
        .select(`
          tag_id,
          tags (
            id,
            name,
            slug
          )
        `)
        .eq("article_id", article.id);

      if (error) throw error;
      return data?.map((at) => at.tags) || [];
    },
    enabled: !!article?.id,
  });

  // Increment view count
  useQuery({
    queryKey: ["article_view", article?.id],
    queryFn: async () => {
      if (!article?.id) return null;
      await supabase
        .from("articles")
        .update({ view_count: (article.view_count || 0) + 1 })
        .eq("id", article.id);
      return true;
    },
    enabled: !!article?.id,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Article Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </main>
      </div>
    );
  }

  const articleTypeBadgeColors: Record<string, string> = {
    article: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    update: "bg-green-500/10 text-green-500 border-green-500/20",
    announcement: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    event: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/blog")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className={articleTypeBadgeColors[article.article_type] || ""}
            >
              {article.article_type.charAt(0).toUpperCase() +
                article.article_type.slice(1)}
            </Badge>
            {article.is_featured && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                ★ Featured
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-muted-foreground mb-6">
              {article.excerpt}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(article.published_at), "MMM d, yyyy")}
              </span>
            )}
            {article.read_time_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.read_time_minutes} min read
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.view_count || 0} views
            </span>
          </div>

          {/* Author */}
          <AuthorBadge author={article.profiles} />

          {/* Linked Location */}
          {article.locations && (
            <Link
              to={`/business/${article.linked_location_id}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" />
              {article.locations.name}, {article.locations.suburb},{" "}
              {article.locations.state}
            </Link>
          )}
        </header>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="mb-12">
          <PlateRenderer
            content={article.content as any[]}
            className="prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary"
          />
        </article>

        {/* Tags */}
        {articleTagsData && articleTagsData.length > 0 && (
          <div className="mb-8">
            <ArticleTags tags={articleTagsData.filter(Boolean) as any[]} />
          </div>
        )}

        {/* Like Button */}
        <div className="mb-8 flex items-center gap-4">
          <ArticleLikeButton articleId={article.id} />
        </div>

        {/* Comments Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Comments
          </h2>
          <ArticleComments articleId={article.id} />
        </section>

        {/* Related Articles */}
        <RelatedArticles
          currentArticleId={article.id}
          tagSlugs={articleTagsData?.filter(Boolean).map((t: any) => t?.slug) || []}
        />
      </main>
    </div>
  );
};

export default BlogArticle;
