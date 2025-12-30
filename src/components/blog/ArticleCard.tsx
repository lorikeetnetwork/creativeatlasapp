import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { LazyImage } from '@/components/ui/lazy-image';

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    cover_image_url: string | null;
    article_type: string;
    read_time_minutes: number | null;
    published_at: string | null;
    created_at: string;
    author?: {
      full_name: string | null;
      email: string;
    } | null;
    _count?: {
      likes: number;
      comments: number;
    };
    tags?: { name: string; slug: string }[];
  };
  featured?: boolean;
}

const typeColors: Record<string, string> = {
  article: 'bg-primary/20 text-primary border-primary/30',
  update: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  announcement: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  event: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const authorName = article.author?.full_name || article.author?.email?.split('@')[0] || 'Anonymous';
  const authorInitials = authorName.slice(0, 2).toUpperCase();
  const publishDate = article.published_at || article.created_at;

  return (
    <Link 
      to={`/blog/${article.slug}`}
      className="group block"
    >
      <article className={cn(
        "relative h-full border-2 border-neutral-800 bg-card overflow-hidden",
        "transition-all duration-300",
        "hover:border-primary/50 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]",
        featured && "md:flex"
      )}>
        {/* Corner markers */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neutral-600 z-20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neutral-600 z-20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neutral-600 z-20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neutral-600 z-20" />

        {/* Image */}
        <div className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "md:w-1/2" : "w-full"
        )}>
          {article.cover_image_url ? (
            <LazyImage
              src={article.cover_image_url}
              alt={article.title}
              ratio={featured ? 4/3 : 16/9}
              inView
              className="transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={cn(
              "w-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center",
              featured ? "aspect-[4/3]" : "aspect-video"
            )}>
              <span className="text-4xl font-bold text-neutral-700 uppercase tracking-widest">
                {article.article_type.charAt(0)}
              </span>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Type badge on image */}
          <Badge 
            variant="secondary" 
            className={cn(
              "absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider border",
              typeColors[article.article_type] || typeColors.article
            )}
          >
            {article.article_type}
          </Badge>
        </div>
        
        {/* Content */}
        <div className={cn(
          "p-5 flex flex-col",
          featured ? "md:w-1/2 md:justify-center" : ""
        )}>
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag.slug} 
                  variant="outline" 
                  className="text-[10px] border-neutral-700 text-muted-foreground hover:border-primary/50"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h3 className={cn(
            "font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}>
            {article.title}
          </h3>
          
          {/* Excerpt */}
          {article.excerpt && (
            <p className={cn(
              "text-muted-foreground line-clamp-2 mb-4",
              featured ? "text-base" : "text-sm"
            )}>
              {article.excerpt}
            </p>
          )}
          
          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 border border-neutral-700">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground font-medium">{authorName}</span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.read_time_minutes || 1} min
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(publishDate), 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
