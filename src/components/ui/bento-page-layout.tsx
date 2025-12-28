import React from "react";
import { cn } from "@/lib/utils";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={cn("w-4 h-4 text-gray-500", className)}
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
    <PlusIcon className="absolute top-2 left-2" />
    <PlusIcon className="absolute top-2 right-2" />
    <PlusIcon className="absolute bottom-2 left-2" />
    <PlusIcon className="absolute bottom-2 right-2" />
  </>
);

export interface BentoPageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const BentoPageHeader: React.FC<BentoPageHeaderProps> = ({
  title,
  description,
  icon,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden mb-6",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">{actions}</div>}
      </div>
    </div>
  );
};

export interface BentoContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const BentoContainer: React.FC<BentoContainerProps> = ({
  children,
  className,
  noPadding = false,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden",
        !noPadding && "p-6",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export interface BentoContentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export const BentoContentCard: React.FC<BentoContentCardProps> = ({
  title,
  children,
  className,
  headerActions,
}) => {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10">
        {(title || headerActions) && (
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {headerActions}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export interface BentoSidebarCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export const BentoSidebarCard: React.FC<BentoSidebarCardProps> = ({
  title,
  children,
  className,
  sticky = false,
}) => {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden",
        sticky && "sticky top-4",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10">
        {title && (
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
};

export interface BentoFilterCardProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoFilterCard: React.FC<BentoFilterCardProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden mb-6",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export interface BentoEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const BentoEmptyState: React.FC<BentoEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative p-12 rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden text-center",
        className
      )}
    >
      <CornerPlusIcons />
      <div className="relative z-10">
        <div className="flex justify-center mb-4 text-gray-500">{icon}</div>
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-6">{description}</p>
        {action}
      </div>
    </div>
  );
};

export interface BentoPageProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoPage: React.FC<BentoPageProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen bg-[#121212]", className)}>
      {children}
    </div>
  );
};

export interface BentoMainProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoMain: React.FC<BentoMainProps> = ({ children, className }) => {
  return (
    <main className={cn("px-4 md:px-8 py-8", className)}>{children}</main>
  );
};
