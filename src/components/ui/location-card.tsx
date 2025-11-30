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
        "cursor-pointer transition-all duration-200 rounded-[16px] p-[2px]",
        isSelected ? "opacity-100" : "opacity-80 hover:opacity-100",
        className
      )}
      style={{
        background: "linear-gradient(71deg, #110e0e, #afa220, #110e0e)",
      }}
      onClick={onClick}
    >
      <div className="rounded-[14px] bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] px-3 py-2.5">
        <h3 className="font-semibold text-sm text-white truncate">{name}</h3>
        <p className="text-xs text-white/60 truncate mt-0.5">
          {category} • {suburb}, {state}
        </p>
      </div>
    </div>
  );
};

export { LocationCard };
