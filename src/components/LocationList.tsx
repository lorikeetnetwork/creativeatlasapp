import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LocationListProps {
  locations: Tables<"locations">[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
}

const LocationList = ({ locations, selectedLocation, onLocationSelect }: LocationListProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-4">
        {locations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No locations found. Try adjusting your filters.
            </CardContent>
          </Card>
        ) : (
          locations.map((location) => (
            <Card
              key={location.id}
              className={`cursor-pointer transition-all hover:shadow-warm ${
                selectedLocation?.id === location.id
                  ? "ring-2 ring-primary shadow-warm"
                  : ""
              }`}
              onClick={() => onLocationSelect(location)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg leading-tight">{location.name}</h3>
                    {location.website && (
                      <a
                        href={location.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{location.category}</Badge>
                    {location.subcategory && (
                      <Badge variant="outline">{location.subcategory}</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {location.suburb}, {location.state}
                    </span>
                  </div>
                  
                  {location.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {location.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default LocationList;
