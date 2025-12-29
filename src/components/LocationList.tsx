import { LocationCard } from "@/components/ui/location-card";
import { Heart } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface LocationWithPhotos extends Tables<"locations"> {
  location_photos?: { photo_url: string; display_order: number | null }[];
}

interface LocationListProps {
  locations: LocationWithPhotos[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
  favoriteIds?: Set<string>;
}

const LocationList = ({
  locations,
  selectedLocation,
  onLocationSelect,
  favoriteIds = new Set(),
}: LocationListProps) => {
  if (locations.length === 0) {
    return (
      <div className="py-8">
        <p className="text-muted-foreground text-center text-sm">
          No locations found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {locations.map((location) => {
        const isSelected = selectedLocation?.id === location.id;
        const isFavorited = favoriteIds.has(location.id);
        return (
          <div key={location.id} className="relative">
            <LocationCard
              name={location.name}
              category={location.category}
              suburb={location.suburb}
              state={location.state}
              isSelected={isSelected}
              onClick={() => onLocationSelect(location)}
            />
            {isFavorited && (
              <Heart className="absolute top-2 right-2 w-3.5 h-3.5 text-red-500 fill-current" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LocationList;
