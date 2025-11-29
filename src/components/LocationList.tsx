import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
interface LocationListProps {
  locations: Tables<"locations">[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
}
const LocationList = ({
  locations,
  selectedLocation,
  onLocationSelect
}: LocationListProps) => {
  if (locations.length === 0) {
    return <div className="py-8">
        <p className="text-muted-foreground text-center text-sm">
          No locations found
        </p>
      </div>;
  }
  return <div className="space-y-2">
      {locations.map(location => {
      const isSelected = selectedLocation?.id === location.id;
      return <Card key={location.id} className={`p-3 cursor-pointer transition-all hover:shadow-md bg-[#111111] border-[#111111] ${isSelected ? "ring-2 ring-primary shadow-sm" : ""}`} onClick={() => onLocationSelect(location)}>
            <div className="flex gap-3">
              {/* Thumbnail Placeholder */}
              <div className="w-14 h-14 flex-shrink-0 rounded bg-gradient-sunset opacity-30" />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-white truncate mb-0.5">
                  {location.name}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {location.category} • {location.suburb}, {location.state}
                </p>
              </div>

              {/* Open Button */}
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs flex-shrink-0 bg-[#111111] text-white border-white/20 hover:bg-[#333333] hover:text-white">
                OPEN
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </Card>;
    })}
    </div>;
};
export default LocationList;