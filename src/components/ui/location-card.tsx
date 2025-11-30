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
        "relative cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full rounded-[20px] p-[2px]",
        isSelected ? "scale-[1.02]" : "opacity-80 hover:opacity-100",
        className
      )}
      style={{
        background: "linear-gradient(71deg, #110e0e, #afa220, #110e0e)",
      }}
      onClick={onClick}
    >
      {/* Inner card with dark background */}
      <div className="w-full rounded-[18px] bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-3">
        <h3 className="font-semibold text-sm text-white truncate">{name}</h3>
        <p className="text-xs text-white/60 truncate mt-0.5">
          {category} • {suburb}, {state}
        </p>
      </div>
    </div>
  );
};

export { LocationCard };
