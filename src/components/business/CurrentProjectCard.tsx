import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

interface CurrentProjectCardProps {
  locationId: string;
}

type BusinessProfile = Tables<"business_profiles">;

const CurrentProjectCard = ({ locationId }: CurrentProjectCardProps) => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [locationId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("location_id", locationId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-64 bg-muted"></div>
        <CardContent className="pt-4">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-muted rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (
    !profile ||
    !profile.current_project_title ||
    profile.current_project_status === "completed"
  ) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No active project at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "upcoming":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-primary";
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "active":
        return "Active Now";
      case "upcoming":
        return "Coming Soon";
      case "completed":
        return "Completed";
      default:
        return "Active";
    }
  };

  return (
    <Card className="overflow-hidden">
      {profile.current_project_image_url && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={profile.current_project_image_url}
            alt={profile.current_project_title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className={getStatusColor(profile.current_project_status)}>
              {getStatusLabel(profile.current_project_status)}
            </Badge>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl md:text-3xl mb-2">
              {profile.current_project_title}
            </CardTitle>
            {(profile.current_project_start_date || profile.current_project_end_date) && (
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {profile.current_project_start_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Started: {format(new Date(profile.current_project_start_date), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
                {profile.current_project_end_date && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {profile.current_project_status === "upcoming" ? "Starts" : "Ends"}:{" "}
                      {format(new Date(profile.current_project_end_date), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      {profile.current_project_description && (
        <CardContent>
          <CardDescription className="text-base leading-relaxed whitespace-pre-wrap">
            {profile.current_project_description}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
};

export default CurrentProjectCard;
