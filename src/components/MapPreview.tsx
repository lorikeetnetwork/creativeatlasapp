import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "./ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";

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

const REGIONS = [
  { center: [153.4, -28.0] as [number, number], zoom: 8, label: "Gold Coast / Northern Rivers" },
  { center: [151.2, -33.9] as [number, number], zoom: 9, label: "Sydney" },
  { center: [144.9, -37.8] as [number, number], zoom: 9, label: "Melbourne" },
  { center: [153.0, -27.5] as [number, number], zoom: 9, label: "Brisbane" },
];

const MapPreview = () => {
  const navigate = useNavigate();
  const { locations, loading } = useLocations();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userInteracting, setUserInteracting] = useState(false);
  const autoPanInterval = useRef<NodeJS.Timeout | null>(null);

  const savedToken = import.meta.env.VITE_MAPBOX_TOKEN || localStorage.getItem("mapbox_token");

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !savedToken) return;

    mapboxgl.accessToken = savedToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [133.7, -25.3], // Center of Australia
        zoom: 4,
        pitch: 0,
        interactive: true,
        scrollZoom: true,
        dragPan: true,
        dragRotate: false,
        touchZoomRotate: true,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        setMapLoaded(true);
      });

      // Detect user interaction
      map.current.on("mousedown", () => setUserInteracting(true));
      map.current.on("dragstart", () => setUserInteracting(true));
      map.current.on("mouseup", () => {
        setUserInteracting(false);
      });
      map.current.on("touchend", () => {
        setUserInteracting(false);
      });
    } catch (err) {
      console.error("Failed to initialize map:", err);
    }

    return () => {
      if (autoPanInterval.current) clearInterval(autoPanInterval.current);
      markers.current.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, [savedToken]);

  // Add markers
  useEffect(() => {
    if (!map.current || !mapLoaded || locations.length === 0) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    locations.forEach((location) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = CATEGORY_COLORS[location.category] || CATEGORY_COLORS.Other;
      el.style.border = "2px solid white";
      el.style.cursor = "default";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
      el.style.transition = "all 0.3s";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit bounds to show all markers initially
    if (locations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach((loc) => {
        bounds.extend([loc.longitude, loc.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 10 });
    }
  }, [locations, mapLoaded]);

  // Auto-pan animation
  useEffect(() => {
    if (!map.current || !mapLoaded || locations.length === 0) return;

    let currentIndex = 0;

    const startAutoPan = () => {
      if (autoPanInterval.current) clearInterval(autoPanInterval.current);

      autoPanInterval.current = setInterval(() => {
        if (!userInteracting && map.current) {
          currentIndex = (currentIndex + 1) % REGIONS.length;
          map.current.easeTo({
            center: REGIONS[currentIndex].center,
            zoom: REGIONS[currentIndex].zoom,
            duration: 3000,
            easing: (t) => t * (2 - t),
          });
        }
      }, 8000);
    };

    // Start after initial fit bounds
    const timeout = setTimeout(startAutoPan, 3000);

    return () => {
      clearTimeout(timeout);
      if (autoPanInterval.current) clearInterval(autoPanInterval.current);
    };
  }, [mapLoaded, locations.length, userInteracting]);

  if (loading) {
    return (
      <div className="w-full h-[600px] lg:h-[700px] bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading map preview...</p>
        </div>
      </div>
    );
  }

  if (!savedToken) {
    return (
      <div className="w-full h-[600px] lg:h-[700px] bg-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <p className="text-foreground">Map preview unavailable</p>
          <Button onClick={() => navigate("/map")}>View Full Map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden border border-border shadow-warm">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Overlay with CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6 md:p-8 z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-1">
              {locations.length}+ Creative Spaces
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              Discover venues, studios, festivals, and more across Australia
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => navigate("/map")}
            className="shrink-0"
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
