import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  article: 'bg-primary/10 text-primary',
  update: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  announcement: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  event: 'bg-green-500/10 text-green-600 dark:text-green-400',
};

export const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const authorName = article.author?.full_name || article.author?.email?.split('@')[0] || 'Anonymous';
  const authorInitials = authorName.slice(0, 2).toUpperCase();
  const publishDate = article.published_at || article.created_at;

  return (
    <Link to={`/blog/${article.slug}`}>
      <Card className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30",
        featured && "md:flex md:h-80"
      )}>
        {article.cover_image_url && (
          <div className={cn(
            "relative overflow-hidden bg-muted",
            featured ? "md:w-1/2 h-48 md:h-full" : "h-48"
          )}>
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}
        
        <CardContent className={cn(
          "p-5",
          featured && "md:w-1/2 md:flex md:flex-col md:justify-center"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className={typeColors[article.article_type] || typeColors.article}>
              {article.article_type.charAt(0).toUpperCase() + article.article_type.slice(1)}
            </Badge>
            {article.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag.slug} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
          
          <h3 className={cn(
            "font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors",
            featured ? "text-2xl" : "text-lg"
          )}>
            {article.title}
          </h3>
          
          {article.excerpt && (
            <p className={cn(
              "text-muted-foreground line-clamp-2 mb-4",
              featured ? "text-base" : "text-sm"
            )}>
              {article.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{authorName}</span>
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
              {article._count && (
                <>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {article._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {article._count.comments}
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleCard;
