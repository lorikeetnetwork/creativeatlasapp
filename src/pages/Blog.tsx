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
  BentoContentCard,
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#222] border-[#333] text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px] bg-[#222] border-[#333] text-white">
                <SelectValue placeholder="Article Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#333]">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="update">Updates</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
                <SelectItem value="event">Events</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-[180px] bg-[#222] border-[#333] text-white">
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#333]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative p-4 rounded-xl border border-[#333] bg-[#1a1a1a] space-y-4">
                <Skeleton className="h-48 w-full rounded-lg bg-[#333]" />
                <Skeleton className="h-4 w-3/4 bg-[#333]" />
                <Skeleton className="h-4 w-1/2 bg-[#333]" />
              </div>
            ))}
          </div>
        )}

        {/* Featured Articles */}
        {featuredArticles && featuredArticles.length > 0 && (
          <BentoContentCard title="★ Featured" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </BentoContentCard>
        )}

        {/* Regular Articles Grid */}
        {regularArticles && regularArticles.length > 0 && (
          <BentoContentCard title="Latest Articles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </BentoContentCard>
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
                className="border-[#333] text-white hover:bg-[#222]"
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
