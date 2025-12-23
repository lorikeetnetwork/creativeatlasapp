import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Tag {
  id?: string;
  name: string;
  slug: string;
}

interface ArticleTagsProps {
  tags: Tag[];
  selectedTags?: string[];
  onTagClick?: (slug: string) => void;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const ArticleTags = ({
  tags,
  selectedTags = [],
  onTagClick,
  size = 'default',
  className,
}: ArticleTagsProps) => {
  const isClickable = !!onTagClick;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.slug);
        
        return (
          <Badge
            key={tag.slug}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              "transition-colors",
              isClickable && "cursor-pointer hover:bg-primary hover:text-primary-foreground",
              size === 'sm' && "text-xs px-2 py-0.5",
              size === 'lg' && "text-sm px-4 py-1.5"
            )}
            onClick={() => onTagClick?.(tag.slug)}
          >
            {tag.name}
          </Badge>
        );
      })}
    </div>
  );
};

export default ArticleTags;
