import { useState, useEffect } from "react";
import { Check, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEventRSVP } from "@/hooks/useEventRSVP";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface RSVPButtonProps {
  eventId: string;
  size?: "default" | "sm" | "lg";
}

const RSVPButton = ({ eventId, size = "default" }: RSVPButtonProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { currentRSVP, isLoading, setRSVP, removeRSVP, isUpdating } = useEventRSVP(eventId);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <Button
        size={size}
        onClick={() => navigate("/auth")}
        className="bg-primary hover:bg-primary/90"
      >
        Sign in to RSVP
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button size={size} disabled>
        Loading...
      </Button>
    );
  }

  const currentStatus = currentRSVP?.status;

  if (currentStatus === "going") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500/10"
            disabled={isUpdating}
          >
            <Check className="h-4 w-4 mr-2" />
            Going
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setRSVP("interested")}>
            <Star className="h-4 w-4 mr-2" />
            Mark as Interested
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => removeRSVP()} className="text-destructive">
            <X className="h-4 w-4 mr-2" />
            Remove RSVP
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (currentStatus === "interested") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={size}
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            disabled={isUpdating}
          >
            <Star className="h-4 w-4 mr-2" />
            Interested
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setRSVP("going")}>
            <Check className="h-4 w-4 mr-2" />
            Mark as Going
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => removeRSVP()} className="text-destructive">
            <X className="h-4 w-4 mr-2" />
            Remove RSVP
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={size} disabled={isUpdating}>
          RSVP
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setRSVP("going")}>
          <Check className="h-4 w-4 mr-2" />
          I'm Going
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRSVP("interested")}>
          <Star className="h-4 w-4 mr-2" />
          Interested
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RSVPButton;
