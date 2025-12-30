import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, PenSquare, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoFilterCard,
  BentoEmptyState,
} from "@/components/ui/bento-page-layout";

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Fetch published articles
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          profiles:author_id (
            id,
            full_name,
            email
          )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch all tags
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Fetch article tags for filtering
  const { data: articleTags } = useQuery({
    queryKey: ["article_tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_tags")
        .select("article_id, tag_id");

      if (error) throw error;
      return data;
    },
  });

  // Filter articles
  const filteredArticles = articles?.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" || article.article_type === selectedType;

    const matchesTag =
      selectedTag === "all" ||
      articleTags?.some(
        (at) => at.article_id === article.id && at.tag_id === selectedTag
      );

    return matchesSearch && matchesType && matchesTag;
  });

  // Get featured articles
  const featuredArticles = filteredArticles?.filter((a) => a.is_featured);
  const regularArticles = filteredArticles?.filter((a) => !a.is_featured);

  return (
    <BentoPage>
      <Navbar />

      <BentoMain>
        {/* Header */}
        <BentoPageHeader
          icon={<FileText className="h-8 w-8" />}
          title="Creative Atlas Blog"
          description="Stories, updates, and insights from the creative community"
          actions={
            <Button
              onClick={() => navigate("/blog/new")}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PenSquare className="h-4 w-4" />
              Write Article
            </Button>
          }
        />

        {/* Filters */}
        <BentoFilterCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-neutral-800 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px] bg-background border-neutral-800 text-foreground">
                <SelectValue placeholder="Article Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-neutral-800">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="update">Updates</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
                <SelectItem value="event">Events</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-[180px] bg-background border-neutral-800 text-foreground">
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent className="bg-card border-neutral-800">
                <SelectItem value="all">All Tags</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </BentoFilterCard>

        {/* Loading State */}
        {articlesLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="relative border-2 border-neutral-800 bg-card overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between pt-4 border-t border-neutral-800">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Articles */}
        {featuredArticles && featuredArticles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
              <h2 className="text-sm font-semibold text-primary uppercase tracking-widest">★ Featured</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredArticles.slice(0, 2).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{
                    ...article,
                    author: article.profiles,
                  }}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        {regularArticles && regularArticles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-neutral-700 to-transparent" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Latest Articles</h2>
              <div className="h-px flex-1 bg-gradient-to-l from-neutral-700 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{
                    ...article,
                    author: article.profiles,
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!articlesLoading && filteredArticles?.length === 0 && (
          <BentoEmptyState
            icon={<FileText className="h-16 w-16" />}
            title="No articles found"
            description="No articles found matching your criteria."
            action={
              <Button
                variant="outline"
                className="border-neutral-700 text-foreground hover:bg-card"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedTag("all");
                }}
              >
                Clear Filters
              </Button>
            }
          />
        )}
      </BentoMain>
    </BentoPage>
  );
};

export default Blog;
