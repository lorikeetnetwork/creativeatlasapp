import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

// Brutalist corner marker
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
        "absolute w-3 h-3 border-neutral-600 pointer-events-none z-20",
        positionClasses[position]
      )}
    />
  );
};

const CornerMarkers = () => (
  <>
    <BrutalistCorner position="tl" />
    <BrutalistCorner position="tr" />
    <BrutalistCorner position="bl" />
    <BrutalistCorner position="br" />
  </>
);

// Stat Card
export interface BentoStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const BentoStatCard: React.FC<BentoStatCardProps> = ({
  label,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative p-5 border-2 border-neutral-800 bg-card",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
    >
      <CornerMarkers />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </span>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Info Item
export interface BentoInfoItemProps {
  icon: React.ReactNode;
  label?: string;
  value: string | React.ReactNode;
  className?: string;
}

export const BentoInfoItem: React.FC<BentoInfoItemProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-8 h-8 border-2 border-neutral-700 flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {label && (
          <span className="text-xs text-muted-foreground uppercase tracking-wider block">
            {label}
          </span>
        )}
        <span className="text-sm text-foreground truncate block">{value}</span>
      </div>
    </div>
  );
};

// Detail Grid
export interface BentoDetailGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const BentoDetailGrid: React.FC<BentoDetailGridProps> = ({
  children,
  columns = 2,
  className,
}) => {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {children}
    </div>
  );
};

// Detail Card
export interface BentoDetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export const BentoDetailCard: React.FC<BentoDetailCardProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative p-4 border-2 border-neutral-800 bg-card",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 border-2 border-neutral-700 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
            {label}
          </span>
          <span className="text-sm text-foreground">{value}</span>
        </div>
      </div>
    </div>
  );
};
