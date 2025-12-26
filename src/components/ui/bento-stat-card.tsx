import React from "react";
import { cn } from "@/lib/utils";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={cn("w-3 h-3 text-gray-600", className)}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute top-1.5 left-1.5" />
    <PlusIcon className="absolute top-1.5 right-1.5" />
    <PlusIcon className="absolute bottom-1.5 left-1.5" />
    <PlusIcon className="absolute bottom-1.5 right-1.5" />
  </>
);

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
        "relative p-4 rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{label}</span>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-sm",
                trend.isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export interface BentoInfoItemProps {
  icon: React.ReactNode;
  label?: string;
  value: React.ReactNode;
  className?: string;
}

export const BentoInfoItem: React.FC<BentoInfoItemProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div>
        {label && <p className="text-sm text-gray-500">{label}</p>}
        <p className="font-medium text-white">{value}</p>
      </div>
    </div>
  );
};

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
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colClasses[columns], className)}>
      {children}
    </div>
  );
};

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
        "flex items-center gap-3 p-4 rounded-lg bg-[#222] border border-[#333]",
        className
      )}
    >
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-white">{value}</p>
      </div>
    </div>
  );
};
