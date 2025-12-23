import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AuthorBadgeProps {
  author: {
    full_name: string | null;
    email: string;
  } | null;
  showName?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const AuthorBadge = ({
  author,
  showName = true,
  size = 'default',
  className,
}: AuthorBadgeProps) => {
  const name = author?.full_name || author?.email?.split('@')[0] || 'Anonymous';
  const initials = name.slice(0, 2).toUpperCase();

  const avatarSizes = {
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base font-medium',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className={avatarSizes[size]}>
        <AvatarFallback
          className={cn(
            "bg-primary/10 text-primary",
            size === 'sm' && "text-[10px]",
            size === 'lg' && "text-base"
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className={cn("text-muted-foreground", textSizes[size])}>
          {name}
        </span>
      )}
    </div>
  );
};

export default AuthorBadge;
