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
        "relative cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full",
        isSelected && "scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      {/* Gradient border wrapper */}
      <div
        className={cn(
          "absolute inset-0 rounded-[20px] p-[1px] transition-opacity",
          isSelected ? "opacity-100" : "opacity-60 hover:opacity-100"
        )}
        style={{
          background: "linear-gradient(71deg, #110e0e, #afa220, #110e0e)",
        }}
      >
        <div className="w-full h-full rounded-[19px] bg-gradient-to-br from-[#080509] via-[#1a171c] to-[#080509]" />
      </div>

      {/* Card content */}
      <div className="relative rounded-[20px] p-3 z-10">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-white truncate">{name}</h3>
          <p className="text-xs text-white/50 truncate">
            {category} • {suburb}, {state}
          </p>
        </div>
      </div>
    </div>
  );
};

export { LocationCard };
