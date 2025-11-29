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

  const getLocationImage = (location: LocationWithPhotos): string | null => {
    // Priority: og_image_url > logo_url > first photo
    if (location.og_image_url) return location.og_image_url;
    if (location.logo_url) return location.logo_url;
    if (location.location_photos?.[0]?.photo_url) {
      return location.location_photos[0].photo_url;
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {locations.map((location) => {
        const isSelected = selectedLocation?.id === location.id;
        return (
          <LocationCard
            key={location.id}
            name={location.name}
            category={location.category}
            suburb={location.suburb}
            state={location.state}
            imageUrl={getLocationImage(location)}
            isSelected={isSelected}
            onClick={() => onLocationSelect(location)}
          />
        );
      })}
    </div>
  );
};

export default LocationList;
