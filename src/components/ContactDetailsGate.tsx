import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

interface ContactDetailsGateProps {
  email?: string | null;
  phone?: string | null;
  showAs?: "inline" | "card";
  children?: React.ReactNode;
}

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (!domain) return "***@***.***";
  const maskedLocal = localPart.slice(0, 2) + "***";
  const domainParts = domain.split(".");
  const maskedDomain = domainParts[0].slice(0, 2) + "***." + (domainParts[1] || "***");
  return `${maskedLocal}@${maskedDomain}`;
};

const maskPhone = (phone: string): string => {
  // Show first 4 chars, mask the rest
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.length <= 4) return "****";
  return cleaned.slice(0, 4) + " *** ***";
};

export const ContactDetailsGate = ({ 
  email, 
  phone, 
  showAs = "inline",
  children 
}: ContactDetailsGateProps) => {
  const navigate = useNavigate();
  const { isSubscribed, isAdmin, isAuthenticated, isLoading } = useSubscription();
  
  const hasAccess = isSubscribed || isAdmin;

  // If user has access, render children (actual contact info)
  if (hasAccess && children) {
    return <>{children}</>;
  }

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-32"></div>
      </div>
    );
  }

  // User doesn't have access - show locked state
  if (showAs === "card") {
    return (
      <div className="relative p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="p-2 rounded-full bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Contact Details Locked</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isAuthenticated 
                ? "Upgrade to view full contact information"
                : "Sign in and subscribe to view contact details"
              }
            </p>
          </div>
          {email && (
            <p className="text-xs text-muted-foreground font-mono blur-[2px] select-none">
              {maskEmail(email)}
            </p>
          )}
          {phone && (
            <p className="text-xs text-muted-foreground font-mono blur-[2px] select-none">
              {maskPhone(phone)}
            </p>
          )}
          <Button 
            size="sm" 
            onClick={() => navigate(isAuthenticated ? "/pricing" : "/auth")}
            className="mt-2"
          >
            <Crown className="w-4 h-4 mr-2" />
            {isAuthenticated ? "View Plans" : "Sign In"}
          </Button>
        </div>
      </div>
    );
  }

  // Inline locked state
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Lock className="w-3 h-3" />
      <span className="text-xs blur-[2px] select-none">
        {email ? maskEmail(email) : phone ? maskPhone(phone) : "Hidden"}
      </span>
      <Button 
        variant="link" 
        size="sm" 
        className="p-0 h-auto text-xs"
        onClick={() => navigate(isAuthenticated ? "/pricing" : "/auth")}
      >
        Unlock
      </Button>
    </div>
  );
};

export const useContactAccess = () => {
  const { isSubscribed, isAdmin, isLoading } = useSubscription();
  return {
    hasAccess: isSubscribed || isAdmin,
    isLoading,
  };
};
