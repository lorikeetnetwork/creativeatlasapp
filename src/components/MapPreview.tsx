import { useNavigate } from "react-router-dom";
import { useLocations } from "@/hooks/useLocations";
import { Button } from "./ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import MapView from "./MapView";

const MapPreview = () => {
  const navigate = useNavigate();
  const { locations, loading } = useLocations();


  if (loading) {
    return (
      <div className="w-full h-[400px] md:h-[600px] lg:h-[700px] bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading map preview...</p>
        </div>
      </div>
    );
  }

  if (!locations.length) {
    return (
      <div className="w-full h-[400px] md:h-[600px] lg:h-[700px] bg-muted/50 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No locations available yet.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden border border-muted-foreground/30 shadow-lg">
      <MapView
        locations={locations}
        selectedLocation={null}
        onLocationSelect={() => {}}
      />

      {/* Overlay CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-6 md:p-8 z-10 pointer-events-none">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-foreground text-2xl md:text-3xl font-bold mb-1">
              {locations.length}+ Creative Spaces
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Discover venues, studios, festivals, and more across Australia
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => navigate("/map")}
            className="shrink-0 pointer-events-auto"
          >
            Explore Full Map
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
