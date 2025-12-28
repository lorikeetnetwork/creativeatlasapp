import React from "react";
import { cn } from "@/lib/utils";
const PlusIcon = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={cn("w-4 h-4 text-gray-500", className)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>;
const CornerPlusIcons = () => <>
    <PlusIcon className="absolute top-2 left-2" />
    <PlusIcon className="absolute top-2 right-2" />
    <PlusIcon className="absolute bottom-2 left-2" />
    <PlusIcon className="absolute bottom-2 right-2" />
  </>;
export interface BentoCardProps {
  className?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}
export const BentoCard: React.FC<BentoCardProps> = ({
  className = "",
  title,
  description,
  children,
  onClick
}) => {
  return <div className={cn("relative p-6 rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-lg", onClick && "cursor-pointer", className)} onClick={onClick}>
      <CornerPlusIcons />
      {/* Content */}
      
    </div>;
};
export interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}
export const BentoGrid: React.FC<BentoGridProps> = ({
  className,
  children
}) => {
  return <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {children}
    </div>;
};
export interface BentoSectionFooterProps {
  title: string;
  description?: string;
  className?: string;
}
export const BentoSectionFooter: React.FC<BentoSectionFooterProps> = ({
  title,
  description,
  className
}) => {
  return <div className={cn("text-center mt-12 md:mt-16", className)}>
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-secondary-foreground">
        {title}
      </h2>
      {description && <p className="text-gray-400 max-w-2xl mx-auto text-base">
          {description}
        </p>}
    </div>;
};