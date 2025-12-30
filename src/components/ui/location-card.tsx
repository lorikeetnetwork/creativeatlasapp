import * as React from "react";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  name: string;
  category: string;
  suburb: string;
  state: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const LocationCard = ({
  name,
  category,
  suburb,
  state,
  isSelected = false,
  onClick,
  className,
}: LocationCardProps) => {
  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-200 p-[2px] border-2 border-neutral-700 bg-card",
        isSelected ? "border-primary opacity-100" : "opacity-80 hover:opacity-100 hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <div className="px-3 py-2.5">
        <h3 className="font-semibold text-sm text-foreground truncate">{name}</h3>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {category} • {suburb}, {state}
        </p>
      </div>
    </div>
  );
};

export { LocationCard };
