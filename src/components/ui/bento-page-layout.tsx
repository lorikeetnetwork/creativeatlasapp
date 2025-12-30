import React from "react";
import { cn } from "@/lib/utils";

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

// Page Header
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
        "relative p-6 md:p-8 border-2 border-neutral-800 bg-card mb-6",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
    >
      <CornerMarkers />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-12 h-12 border-2 border-neutral-700 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">{actions}</div>}
      </div>
    </div>
  );
};

// Container
export interface BentoContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  noBorder?: boolean;
}

export const BentoContainer: React.FC<BentoContainerProps> = ({
  children,
  className,
  noPadding = false,
  noBorder = false,
}) => {
  return (
    <div
      className={cn(
        "relative bg-card",
        !noBorder && "border-2 border-neutral-800",
        !noPadding && "p-6",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
    >
      {!noBorder && <CornerMarkers />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Content Card
export interface BentoContentCardProps {
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
  className?: string;
}

export const BentoContentCard: React.FC<BentoContentCardProps> = ({
  children,
  title,
  headerActions,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative border-2 border-neutral-800 bg-card",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
    >
      <CornerMarkers />
      {(title || headerActions) && (
        <div className="flex items-center justify-between p-4 border-b-2 border-neutral-800">
          {title && (
            <h2 className="text-lg font-semibold text-foreground tracking-tight uppercase">
              {title}
            </h2>
          )}
          {headerActions}
        </div>
      )}
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};

// Sidebar Card
export interface BentoSidebarCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  sticky?: boolean;
}

export const BentoSidebarCard: React.FC<BentoSidebarCardProps> = ({
  children,
  title,
  className,
  sticky = false,
}) => {
  return (
    <div
      className={cn(
        "relative border-2 border-neutral-800 bg-card",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        sticky && "lg:sticky lg:top-20",
        className
      )}
    >
      <CornerMarkers />
      {title && (
        <div className="p-4 border-b-2 border-neutral-800">
          <h3 className="text-sm font-semibold text-foreground tracking-tight uppercase">
            {title}
          </h3>
        </div>
      )}
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};

// Filter Card
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
        "relative p-4 border-2 border-neutral-800 bg-card mb-6",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]",
        className
      )}
    >
      <CornerMarkers />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Empty State
export interface BentoEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
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
        "relative p-12 border-2 border-neutral-800 border-dashed bg-card/50 text-center",
        className
      )}
    >
      {icon && (
        <div className="mx-auto mb-4 text-muted-foreground opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight uppercase">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
};

// Page wrapper
export interface BentoPageProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoPage: React.FC<BentoPageProps> = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen bg-background w-full", className)}>
      {children}
    </div>
  );
};

// Main content wrapper
export interface BentoMainProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const BentoMain: React.FC<BentoMainProps> = ({ children, className, fullWidth = true }) => {
  return (
    <main className={cn(
      "w-full px-4 md:px-6 lg:px-8 xl:px-12 py-6 space-y-6",
      !fullWidth && "container mx-auto",
      className
    )}>
      {children}
    </main>
  );
};
