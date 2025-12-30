import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useResource } from "@/hooks/useResources";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { PlateRenderer } from "@/components/blog/PlateRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Download, ExternalLink, Eye, User, Calendar, BookOpen, FileText, Wrench, FolderOpen, GraduationCap } from "lucide-react";
import { format } from "date-fns";

const resourceTypeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  guide: { label: "Guide", icon: BookOpen, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  template: { label: "Template", icon: FileText, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  tool: { label: "Tool", icon: Wrench, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  directory: { label: "Directory", icon: FolderOpen, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  tutorial: { label: "Tutorial", icon: GraduationCap, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
};

const ResourceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading } = useResource(slug || "");

  // Increment view count
  useEffect(() => {
    if (resource?.id) {
      supabase
        .from("resources")
        .update({ view_count: (resource.view_count || 0) + 1 })
        .eq("id", resource.id)
        .then();
    }
  }, [resource?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full rounded-lg mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Resource not found</h1>
          <Button variant="outline" onClick={() => navigate("/resources")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </main>
      </div>
    );
  }

  const typeConfig = resourceTypeConfig[resource.resource_type] || resourceTypeConfig.guide;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          className="-ml-2 mb-6 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/resources")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>

        {/* Cover Image */}
        {resource.cover_image_url && (
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <img
              src={resource.cover_image_url}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={typeConfig.color}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {typeConfig.label}
            </Badge>
            {resource.category && (
              <Badge variant="outline">{resource.category}</Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {resource.title}
          </h1>

          {resource.description && (
            <p className="text-lg text-muted-foreground mb-6">
              {resource.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{resource.author?.full_name || resource.author?.email || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(resource.created_at), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{resource.view_count ?? 0} views</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {(resource.external_url || resource.file_url) && (
          <div className="flex gap-4 mb-8">
            {resource.file_url && (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resource
                </a>
              </Button>
            )}
            {resource.external_url && (
              <Button variant="outline" asChild>
                <a href={resource.external_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        {resource.content && Array.isArray(resource.content) && resource.content.length > 0 && (
          <div className="prose prose-invert max-w-none">
            <PlateRenderer content={resource.content as any[]} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourceDetail;
