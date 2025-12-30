import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download, ExternalLink, FileText, BookOpen, Wrench, FolderOpen, GraduationCap } from "lucide-react";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    cover_image_url?: string | null;
    resource_type: string;
    category?: string | null;
    view_count?: number | null;
    external_url?: string | null;
    file_url?: string | null;
    author?: {
      id: string;
      full_name?: string | null;
      email: string;
    } | null;
  };
  featured?: boolean;
}

const resourceTypeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  guide: { label: "Guide", icon: BookOpen, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  template: { label: "Template", icon: FileText, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  tool: { label: "Tool", icon: Wrench, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  directory: { label: "Directory", icon: FolderOpen, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  tutorial: { label: "Tutorial", icon: GraduationCap, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
};

export function ResourceCard({ resource, featured }: ResourceCardProps) {
  const navigate = useNavigate();
  const typeConfig = resourceTypeConfig[resource.resource_type] || resourceTypeConfig.guide;
  const TypeIcon = typeConfig.icon;

  return (
    <Card
      className={`group cursor-pointer overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 ${
        featured ? "md:col-span-2" : ""
      }`}
      onClick={() => navigate(`/resources/${resource.slug}`)}
    >
      <div className="relative">
        {resource.cover_image_url ? (
          <div className={`relative ${featured ? "h-64" : "h-48"} overflow-hidden`}>
            <img
              src={resource.cover_image_url}
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className={`relative ${featured ? "h-64" : "h-48"} bg-muted flex items-center justify-center`}>
            <TypeIcon className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={typeConfig.color}>
            <TypeIcon className="h-3 w-3 mr-1" />
            {typeConfig.label}
          </Badge>
        </div>

        {/* Download/Link indicator */}
        {(resource.external_url || resource.file_url) && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/80">
              {resource.file_url ? (
                <Download className="h-3 w-3" />
              ) : (
                <ExternalLink className="h-3 w-3" />
              )}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {resource.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {resource.author?.full_name || resource.author?.email || "Anonymous"}
          </span>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{resource.view_count ?? 0}</span>
          </div>
        </div>

        {resource.category && (
          <Badge variant="outline" className="mt-3 text-xs">
            {resource.category}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
