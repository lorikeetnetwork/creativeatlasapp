import React from "react";
import { cn } from "@/lib/utils";

// Brutalist corner marker component
const BrutalistCorner = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
  const positionClasses = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };

  return (
    <div
      className={cn(
        "absolute w-3 h-3 border-neutral-600 pointer-events-none",
        positionClasses[position]
      )}
    />
  );
};

// Corner markers for brutalist cards
export const BrutalistCorners = () => (
  <>
    <BrutalistCorner position="tl" />
    <BrutalistCorner position="tr" />
    <BrutalistCorner position="bl" />
    <BrutalistCorner position="br" />
  </>
);

export interface BrutalistBentoItemProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// Main brutalist bento item component
export const BrutalistBentoItem: React.FC<BrutalistBentoItemProps> = ({
  className = "",
  children,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "relative p-6 border-2 border-neutral-800 bg-card overflow-hidden transition-all duration-200",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        "hover:border-primary/50 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        onClick && "cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <BrutalistCorners />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export interface BrutalistBentoGridProps {
  className?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
}

// Grid wrapper for brutalist bento items
export const BrutalistBentoGrid: React.FC<BrutalistBentoGridProps> = ({
  className,
  children,
  columns = 4,
}) => {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {children}
    </div>
  );
};

export interface BrutalistSectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const BrutalistSectionHeader: React.FC<BrutalistSectionHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("text-center mt-12 md:mt-16", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight uppercase">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-base">
          {description}
        </p>
      )}
    </div>
  );
};

export default BrutalistBentoItem;
