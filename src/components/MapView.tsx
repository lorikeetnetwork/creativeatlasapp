import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Tables } from "@/integrations/supabase/types";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapViewProps {
  locations: Tables<"locations">[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Venue: "#E91E63",
  Studio: "#9C27B0",
  Festival: "#FFC107",
  Label: "#2196F3",
  Management: "#009688",
  Services: "#9C27B0",
  Education: "#FF5722",
  "Government/Peak Body": "#3F51B5",
  "Community Organisation": "#4CAF50",
  "Co-working/Creative Hub": "#00BCD4",
  "Gallery/Arts Space": "#E91E63",
  Other: "#9E9E9E",
};

const MapView = ({ locations, selectedLocation, onLocationSelect }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [153.4, -28.0], // Gold Coast / Northern Rivers area
      zoom: 8,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    locations.forEach((location) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = CATEGORY_COLORS[location.category] || CATEGORY_COLORS.Other;
      el.style.border = "3px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
      el.style.transition = "all 0.2s";

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      el.addEventListener("click", () => {
        onLocationSelect(location);
      });

      markers.current.push(marker);
    });

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach((loc) => {
        bounds.extend([loc.longitude, loc.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [locations, mapLoaded, onLocationSelect]);

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
        el.style.transform = "scale(1.3)";
        el.style.zIndex = "1000";
      } else {
        el.style.transform = "scale(1)";
        el.style.zIndex = "1";
      }
    });
  }, [selectedLocation, locations]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};

export default MapView;
