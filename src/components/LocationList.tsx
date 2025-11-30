import { LocationCard } from "@/components/ui/location-card";
import type { Tables } from "@/integrations/supabase/types";

interface LocationWithPhotos extends Tables<"locations"> {
  location_photos?: { photo_url: string; display_order: number | null }[];
}

interface LocationListProps {
  locations: LocationWithPhotos[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
}

const LocationList = ({
  locations,
  selectedLocation,
  onLocationSelect,
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
    <div className="space-y-3 w-full">
      {locations.map((location) => {
        const isSelected = selectedLocation?.id === location.id;
        return (
          <LocationCard
            key={location.id}
            name={location.name}
            category={location.category}
            suburb={location.suburb}
            state={location.state}
            isSelected={isSelected}
            onClick={() => onLocationSelect(location)}
          />
        );
      })}
    </div>
  );
};

export default LocationList;
