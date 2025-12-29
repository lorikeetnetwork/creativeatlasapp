import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => void;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function FavoriteButton({
  isFavorited,
  onToggle,
  size = "default",
  className,
}: FavoriteButtonProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const buttonSize = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        buttonSize,
        "transition-all duration-200",
        isFavorited && "text-red-500 hover:text-red-600",
        className
      )}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          iconSize,
          "transition-all duration-200",
          isFavorited && "fill-current"
        )}
      />
    </Button>
  );
}
