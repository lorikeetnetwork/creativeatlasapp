import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Image as ImageIcon } from "lucide-react";

interface ShowcaseCardProps {
  showcase: {
    id: string;
    project_title: string;
    slug: string;
    description: string;
    cover_image_url?: string | null;
    category?: string | null;
    view_count?: number | null;
    is_featured?: boolean | null;
    tags?: string[] | null;
    submitter?: {
      id: string;
      full_name?: string | null;
      email: string;
    } | null;
  };
}

export function ShowcaseCard({ showcase }: ShowcaseCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
      onClick={() => navigate(`/showcases/${showcase.slug}`)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {showcase.cover_image_url ? (
          <img
            src={showcase.cover_image_url}
            alt={showcase.project_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured badge */}
        {showcase.is_featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-amber-500/90 text-white border-none">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
        
        {/* View count */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/80">
            <Eye className="h-3 w-3 mr-1" />
            {showcase.view_count ?? 0}
          </Badge>
        </div>

        {/* Title overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-semibold text-white text-lg line-clamp-2">
            {showcase.project_title}
          </h3>
          <p className="text-white/70 text-sm mt-1">
            by {showcase.submitter?.full_name || showcase.submitter?.email || "Anonymous"}
          </p>
        </div>
      </div>

      {/* Content - visible by default */}
      <div className="p-4 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
          {showcase.project_title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {showcase.description}
        </p>

        <div className="flex items-center justify-between">
          {showcase.category && (
            <Badge variant="outline" className="text-xs">
              {showcase.category}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {showcase.submitter?.full_name || "Anonymous"}
          </span>
        </div>
      </div>
    </div>
  );
}
