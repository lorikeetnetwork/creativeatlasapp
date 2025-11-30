import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getCategoryColor } from "@/utils/categoryColors";

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapViewProps {
  locations: Tables<"locations">[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
}

const MapView = ({ locations, selectedLocation, onLocationSelect, onBoundsChange }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const hasInitiallyFitBounds = useRef(false);
  const initialLocationsRef = useRef<Tables<"locations">[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Store first non-empty locations for initial bounds fit
  if (locations.length > 0 && initialLocationsRef.current.length === 0) {
    initialLocationsRef.current = locations;
  }
  const [error, setError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [savedToken, setSavedToken] = useState<string | null>(
    import.meta.env.VITE_MAPBOX_TOKEN || localStorage.getItem("mapbox_token") || "pk.eyJ1IjoibG9yaWtlZXRuZXR3b3JrIiwiYSI6ImNtaThya2R6bDBmNnQyaXBydDV6dGdocjgifQ.iGQZTbQ3tP_hHIQQcae9Qw"
  );

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setSavedToken(tokenInput.trim());
      mapboxgl.accessToken = tokenInput.trim();
      setTokenInput("");
      window.location.reload();
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check if token is available
    if (!savedToken) {
      setError("Mapbox token not configured");
      return;
    }

    mapboxgl.accessToken = savedToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [153.4, -28.0], // Gold Coast / Northern Rivers area
        zoom: 8,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        setMapLoaded(true);
        // Emit initial bounds
        if (map.current && onBoundsChange) {
          const bounds = map.current.getBounds();
          onBoundsChange({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          });
        }
      });

      // Listen for map movement to update bounds
      map.current.on("moveend", () => {
        if (map.current && onBoundsChange) {
          const bounds = map.current.getBounds();
          onBoundsChange({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          });
        }
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
        setError("Failed to load map");
      });
    } catch (err) {
      console.error("Failed to initialize map:", err);
      setError("Failed to initialize map");
    }

    return () => {
      markers.current.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, [savedToken]);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Store ref to current map to avoid closure issues
    const currentMap = map.current;

    // Add new markers
    locations.forEach((location) => {
      if (!currentMap) return;
      
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = getCategoryColor(location.category);
      el.style.border = "2px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";

      el.addEventListener("mouseenter", () => {
        el.style.boxShadow = "0 0 0 4px rgba(255,255,255,0.5), 0 2px 12px rgba(0,0,0,0.4)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(currentMap);

      el.addEventListener("click", () => {
        onLocationSelect(location);
      });

      markers.current.push(marker);
    });
  }, [locations, mapLoaded, onLocationSelect]);

  // Fit bounds ONLY ONCE on initial load - separate effect to prevent re-triggering
  useEffect(() => {
    if (!map.current || !mapLoaded || hasInitiallyFitBounds.current) return;
    if (initialLocationsRef.current.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    initialLocationsRef.current.forEach((loc) => {
      bounds.extend([loc.longitude, loc.latitude]);
    });
    map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    hasInitiallyFitBounds.current = true;
  }, [mapLoaded]); // Only depend on mapLoaded, NOT locations

  // Fly to selected location
  useEffect(() => {
    if (!map.current || !selectedLocation) return;

    map.current.flyTo({
      center: [selectedLocation.longitude, selectedLocation.latitude],
      zoom: 14,
      duration: 1000,
    });

    // Highlight selected marker
    markers.current.forEach((marker, index) => {
      const el = marker.getElement();
      if (locations[index]?.id === selectedLocation.id) {
        el.style.boxShadow = "0 0 0 4px rgba(255,255,255,0.8), 0 4px 16px rgba(0,0,0,0.5)";
        el.style.zIndex = "1000";
      } else {
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        el.style.zIndex = "1";
      }
    });
  }, [selectedLocation, locations]);

  if (error) {
    return (
      <div className="w-full h-full bg-card border border-border flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-4">
          <p className="text-foreground font-medium mb-2">{error}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Mapbox public token (starts with pk.) to load the map.
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.your_mapbox_token_here"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveToken} disabled={!tokenInput.trim()}>
              Save Token
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Get your token at{" "}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default MapView;
