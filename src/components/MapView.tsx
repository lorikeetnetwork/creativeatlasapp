import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getCategoryColor } from "@/utils/categoryColors";
import type { MapStyle, MarkerColorMode } from "@/hooks/useMapPreferences";
import { normalizeCoordinates } from "@/utils/geo";
import { useMapboxToken } from "@/hooks/useMapboxToken";

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
  favoriteIds?: Set<string>;
  mapStyle?: MapStyle;
  colorMode?: MarkerColorMode;
  onStyleChange?: (style: MapStyle) => void;
  onColorModeChange?: (mode: MarkerColorMode) => void;
}

const MAP_STYLE_URLS: Record<MapStyle, string> = {
  dark: "mapbox://styles/mapbox/dark-v11",
  light: "mapbox://styles/mapbox/light-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  streets: "mapbox://styles/mapbox/streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  blueprint: "mapbox://styles/mapbox/dark-v11", // Base style, we'll customize it
  "satellite-3d": "mapbox://styles/mapbox/satellite-streets-v12", // Satellite with 3D terrain
  "3d": "mapbox://styles/mapbox/standard", // Standard style with 3D support
};

// Apply 3D terrain and buildings
const apply3DStyle = (map: mapboxgl.Map) => {
  setTimeout(() => {
    if (!map.isStyleLoaded()) return;
    
    try {
      // Add terrain source if not exists
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
      }
      
      // Enable terrain with exaggeration
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      
      // Add 3D building extrusions
      if (!map.getLayer('3d-buildings')) {
        // Find a good label layer to insert before
        const layers = map.getStyle()?.layers || [];
        let labelLayerId: string | undefined;
        for (const layer of layers) {
          if (layer.type === 'symbol' && layer.layout?.['text-field']) {
            labelLayerId = layer.id;
            break;
          }
        }
        
        map.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'height'],
                0, '#ddd',
                50, '#ccc',
                100, '#bbb',
                200, '#aaa'
              ],
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.8
            }
          },
          labelLayerId
        );
      }
      
      // Add sky layer for atmosphere
      if (!map.getLayer('sky')) {
        map.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      }
      
      // Set pitch for 3D view
      map.easeTo({ pitch: 60, bearing: -17.6, duration: 1000 });
      
    } catch (e) {
      console.warn("Could not apply 3D styling:", e);
    }
  }, 200);
};

// Remove 3D effects when switching away
const remove3DStyle = (map: mapboxgl.Map) => {
  try {
    map.setTerrain(null);
    if (map.getLayer('sky')) {
      map.removeLayer('sky');
    }
    if (map.getLayer('3d-buildings')) {
      map.removeLayer('3d-buildings');
    }
    map.easeTo({ pitch: 0, bearing: 0, duration: 500 });
  } catch {
    // Ignore errors when removing
  }
};

// Blueprint style layer customizations
const BLUEPRINT_COLORS = {
  background: "#0a192f",
  water: "#0d2847",
  land: "#0a192f",
  roads: "#00d4ff",
  buildings: "#1e3a5f",
  labels: "#00d4ff",
  borders: "#00d4ff",
};

const applyBlueprintStyle = (map: mapboxgl.Map) => {
  // Use setTimeout to ensure all layers are fully loaded and painted
  setTimeout(() => {
    if (!map.isStyleLoaded()) return;
    
    try {
      const allLayers = map.getStyle()?.layers || [];
      
      allLayers.forEach(layer => {
        try {
          // Background layer
          if (layer.type === 'background') {
            map.setPaintProperty(layer.id, 'background-color', BLUEPRINT_COLORS.background);
          }
          // Fill layers (water, land, buildings, parks)
          else if (layer.type === 'fill') {
            if (layer.id.includes('water')) {
              map.setPaintProperty(layer.id, 'fill-color', BLUEPRINT_COLORS.water);
            } else if (layer.id.includes('building')) {
              map.setPaintProperty(layer.id, 'fill-color', BLUEPRINT_COLORS.buildings);
              map.setPaintProperty(layer.id, 'fill-outline-color', BLUEPRINT_COLORS.roads);
            } else if (layer.id.includes('land') || layer.id.includes('park') || layer.id.includes('grass') || layer.id.includes('national')) {
              map.setPaintProperty(layer.id, 'fill-color', BLUEPRINT_COLORS.land);
            }
          }
          // Line layers (roads, borders, paths)
          else if (layer.type === 'line') {
            if (layer.id.includes('road') || layer.id.includes('tunnel') || layer.id.includes('bridge') || layer.id.includes('path') || layer.id.includes('street') || layer.id.includes('motorway') || layer.id.includes('trunk') || layer.id.includes('link')) {
              map.setPaintProperty(layer.id, 'line-color', BLUEPRINT_COLORS.roads);
              map.setPaintProperty(layer.id, 'line-opacity', 0.8);
            } else if (layer.id.includes('boundary') || layer.id.includes('admin') || layer.id.includes('border')) {
              map.setPaintProperty(layer.id, 'line-color', BLUEPRINT_COLORS.borders);
              map.setPaintProperty(layer.id, 'line-opacity', 0.6);
            }
          }
          // Symbol layers (labels, icons)
          else if (layer.type === 'symbol') {
            map.setPaintProperty(layer.id, 'text-color', BLUEPRINT_COLORS.labels);
            map.setPaintProperty(layer.id, 'text-halo-color', BLUEPRINT_COLORS.background);
            map.setPaintProperty(layer.id, 'text-halo-width', 1);
          }
        } catch {
          // Silently skip layers that can't be modified
        }
      });
    } catch (e) {
      console.warn("Could not apply blueprint styling:", e);
    }
  }, 150);
};

const MONO_COLOR = "#6366f1"; // Indigo
const HIGH_CONTRAST_COLOR = "#ffffff";

const MapView = ({
  locations,
  selectedLocation,
  onLocationSelect,
  onBoundsChange,
  favoriteIds = new Set(),
  mapStyle = "dark",
  colorMode = "category",
  onStyleChange,
  onColorModeChange,
}: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersMap = useRef<
    Map<string, { marker: mapboxgl.Marker; element: HTMLDivElement }>
  >(new Map());
  const markerDebugLoggedIds = useRef<Set<string>>(new Set());
  const hasInitiallyFitBounds = useRef(false);
  const initialLocationsRef = useRef<Tables<"locations">[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleReady, setStyleReady] = useState(false);

  const [debugEnabled] = useState(() => {
    try {
      const url = new URL(window.location.href);
      return (
        url.searchParams.get("mapDebug") === "1" ||
        localStorage.getItem("mapDebug") === "1"
      );
    } catch {
      return false;
    }
  });
  const [debugInfo, setDebugInfo] = useState<
    | {
        id: string;
        name: string;
        lat: number;
        lng: number;
        zoom: number;
        dx: number;
        dy: number;
      }
    | null
  >(null);

  // Store first non-empty locations for initial bounds fit
  if (locations.length > 0 && initialLocationsRef.current.length === 0) {
    initialLocationsRef.current = locations;
  }
  const [tokenInput, setTokenInput] = useState("");
  const { token: savedToken, loading: tokenLoading, error: tokenError, saveToken } = useMapboxToken();

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      saveToken(tokenInput.trim());
      mapboxgl.accessToken = tokenInput.trim();
      setTokenInput("");
      window.location.reload();
    }
  };

  const getMarkerColor = (location: Tables<"locations">): string => {
    switch (colorMode) {
      case "mono":
        return MONO_COLOR;
      case "highContrast":
        return HIGH_CONTRAST_COLOR;
      default:
        return getCategoryColor(location.category);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || tokenLoading) return;

    // Check if token is available
    if (!savedToken) {
      return;
    }

    mapboxgl.accessToken = savedToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLE_URLS[mapStyle],
        center: [153.4, -28.0], // Gold Coast / Northern Rivers area
        zoom: 8,
        renderWorldCopies: false,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        setMapLoaded(true);
        setStyleReady(true);
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

      // Mark style as ready whenever the map becomes idle (covers style changes too)
      map.current.on("idle", () => {
        setStyleReady(true);
      });

      // Handle style changes - markers need to be re-added after style loads
      map.current.on("style.load", () => {
        setStyleReady(true);
        // Apply blueprint customizations if blueprint style is selected
        if (mapStyle === "blueprint" && map.current) {
          applyBlueprintStyle(map.current);
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
      });
    } catch (err) {
      console.error("Failed to initialize map:", err);
    }

    return () => {
      markersMap.current.forEach(({ marker }) => marker.remove());
      markersMap.current.clear();
      map.current?.remove();
    };
  }, [savedToken, tokenLoading]);

  // Keep Mapbox rendering in sync with layout changes (sidebar open/close, responsive, etc.)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const container = mapContainer.current;
    if (!container) return;

    let raf = 0;
    const scheduleResize = () => {
      if (!map.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        map.current?.resize();
      });
    };

    scheduleResize();

    const ro = new ResizeObserver(() => scheduleResize());
    ro.observe(container);
    window.addEventListener("resize", scheduleResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleResize);
    };
  }, [mapLoaded]);

  // Debug: measure pixel offset between Mapbox projection and marker DOM position.
  // Enable by adding ?mapDebug=1 to the URL (or localStorage.setItem('mapDebug','1')).
  useEffect(() => {
    if (!debugEnabled) return;
    if (!map.current || !mapLoaded || !styleReady) return;
    if (!locations.length) return;

    const currentMap = map.current;

    const compute = () => {
      const first = locations[0];
      const entry = markersMap.current.get(first.id);
      if (!entry) return;

      const { lat, lng } = normalizeCoordinates({
        latitude: first.latitude as unknown as number,
        longitude: first.longitude as unknown as number,
      });

      const projected = currentMap.project([lng, lat]);
      const mapRect = currentMap.getContainer().getBoundingClientRect();

      const markerEl = entry.element;
      const wrapper = markerEl.parentElement; // .mapboxgl-marker
      if (!wrapper) return;
      const markerRect = wrapper.getBoundingClientRect();

      const markerCenterX = markerRect.left - mapRect.left + markerRect.width / 2;
      const markerCenterY = markerRect.top - mapRect.top + markerRect.height / 2;

      setDebugInfo({
        id: first.id,
        name: first.name,
        lat,
        lng,
        zoom: currentMap.getZoom(),
        dx: markerCenterX - projected.x,
        dy: markerCenterY - projected.y,
      });
    };

    compute();

    currentMap.on("move", compute);
    currentMap.on("zoom", compute);

    return () => {
      currentMap.off("move", compute);
      currentMap.off("zoom", compute);
    };
  }, [debugEnabled, mapLoaded, styleReady, locations]);

  // Handle style changes - set styleReady to false during transition
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    setStyleReady(false);
    // Clear existing markers before style change
    markersMap.current.forEach(({ marker }) => marker.remove());
    markersMap.current.clear();

    // Remove 3D effects before changing style (if not going to a 3D style)
    if (mapStyle !== "3d" && mapStyle !== "satellite-3d") {
      remove3DStyle(map.current);
    }

    map.current.setStyle(MAP_STYLE_URLS[mapStyle]);

    // Apply style-specific customizations after style fully loads
    if (mapStyle === "blueprint") {
      map.current.once("idle", () => {
        if (map.current) {
          applyBlueprintStyle(map.current);
        }
      });
    } else if (mapStyle === "3d" || mapStyle === "satellite-3d") {
      map.current.once("idle", () => {
        if (map.current) {
          apply3DStyle(map.current);
        }
      });
    }
  }, [mapStyle, mapLoaded]);

  // Update markers when locations change - smart updates to prevent flickering
  useEffect(() => {
    if (!map.current || !mapLoaded || !styleReady) return;

    const currentMap = map.current;
    const currentLocationIds = new Set(locations.map((l) => l.id));
    const existingIds = new Set(markersMap.current.keys());

    // Remove markers that are no longer in locations
    existingIds.forEach((id) => {
      if (!currentLocationIds.has(id)) {
        const entry = markersMap.current.get(id);
        if (entry) {
          entry.marker.remove();
          markersMap.current.delete(id);
        }
      }
    });

    // Add markers for new locations and update existing ones
    locations.forEach((location) => {
      const { lat, lng } = normalizeCoordinates({
        latitude: location.latitude as unknown as number,
        longitude: location.longitude as unknown as number,
      });

      if (import.meta.env.DEV && !markerDebugLoggedIds.current.has(location.id)) {
        markerDebugLoggedIds.current.add(location.id);
        // eslint-disable-next-line no-console
        console.debug("[MapView] marker coords", {
          id: location.id,
          name: location.name,
          raw: { latitude: location.latitude, longitude: location.longitude },
          normalized: { lat, lng },
        });
      }

      const existing = markersMap.current.get(location.id);
      if (existing) {
        // Ensure existing markers stay pinned to their exact coordinates
        existing.marker.setLngLat([lng, lat]);
        existing.element.style.backgroundColor = getMarkerColor(location);
        existing.element.style.border =
          colorMode === "highContrast" ? "2px solid #000" : "2px solid white";
        return;
      }

      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.position = "relative";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = getMarkerColor(location);
      el.style.border =
        colorMode === "highContrast" ? "2px solid #000" : "2px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      el.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
      

      // Add favorite indicator
      if (favoriteIds.has(location.id)) {
        const heart = document.createElement("div");
        heart.innerHTML = "♥";
        heart.style.position = "absolute";
        heart.style.top = "-6px";
        heart.style.right = "-6px";
        heart.style.fontSize = "10px";
        heart.style.color = "#ef4444";
        heart.style.textShadow = "0 1px 2px rgba(0,0,0,0.5)";
        el.appendChild(heart);
      }

      el.addEventListener("mouseenter", () => {
        if (selectedLocation?.id !== location.id) {
          el.style.boxShadow =
            "0 0 0 4px rgba(255,255,255,0.5), 0 2px 12px rgba(0,0,0,0.4)";
        }
      });

      el.addEventListener("mouseleave", () => {
        if (selectedLocation?.id !== location.id) {
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        }
      });

      // Guard against map being removed during async operations
      if (!currentMap || !currentMap.getContainer()) return;

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([lng, lat]).addTo(currentMap);

      el.addEventListener("click", () => {
        onLocationSelect(location);
      });

      markersMap.current.set(location.id, { marker, element: el });
    });
  }, [
    locations,
    mapLoaded,
    styleReady,
    onLocationSelect,
    selectedLocation,
    colorMode,
    favoriteIds,
  ]);

  // Update marker colors when color mode changes
  useEffect(() => {
    if (!mapLoaded) return;

    markersMap.current.forEach(({ element }, id) => {
      const location = locations.find((l) => l.id === id);
      if (location) {
        element.style.backgroundColor = getMarkerColor(location);
        element.style.border =
          colorMode === "highContrast" ? "2px solid #000" : "2px solid white";
      }
    });
  }, [colorMode, locations, mapLoaded]);

  // Update favorite indicators when favoriteIds change
  useEffect(() => {
    if (!mapLoaded) return;

    markersMap.current.forEach(({ element }, id) => {
      // Remove existing heart if any
      const existingHeart = element.querySelector("div");
      if (existingHeart) {
        existingHeart.remove();
      }

      // Add heart if favorited
      if (favoriteIds.has(id)) {
        const heart = document.createElement("div");
        heart.innerHTML = "♥";
        heart.style.position = "absolute";
        heart.style.top = "-6px";
        heart.style.right = "-6px";
        heart.style.fontSize = "10px";
        heart.style.color = "#ef4444";
        heart.style.textShadow = "0 1px 2px rgba(0,0,0,0.5)";
        element.appendChild(heart);
      }
    });
  }, [favoriteIds, mapLoaded]);

  // Fit bounds ONLY ONCE on initial load - separate effect to prevent re-triggering
  useEffect(() => {
    if (!map.current || !mapLoaded || hasInitiallyFitBounds.current) return;
    if (initialLocationsRef.current.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    initialLocationsRef.current.forEach((loc) => {
      const { lat, lng } = normalizeCoordinates({
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
      bounds.extend([lng, lat]);
    });
    map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    hasInitiallyFitBounds.current = true;
  }, [mapLoaded]); // Only depend on mapLoaded, NOT locations

  // Highlight selected marker (no flyTo - user controls the map)
  useEffect(() => {
    if (!map.current) return;

    // Update all marker styles based on selection
    markersMap.current.forEach(({ element }, id) => {
      // Remove existing orange ring if any
      const existingRing = element.querySelector(".selection-ring");
      if (existingRing) {
        existingRing.remove();
      }

      if (selectedLocation?.id === id) {
        // Add orange ring around selected marker
        const ring = document.createElement("div");
        ring.className = "selection-ring";
        ring.style.position = "absolute";
        ring.style.top = "-6px";
        ring.style.left = "-6px";
        ring.style.width = "calc(100% + 12px)";
        ring.style.height = "calc(100% + 12px)";
        ring.style.borderRadius = "50%";
        ring.style.border = "3px solid #f97316"; // Orange-500
        ring.style.pointerEvents = "none";
        ring.style.animation = "pulse-ring 1.5s ease-in-out infinite";
        element.appendChild(ring);

        // Enlarge and highlight the marker
        element.style.transform = "scale(1.4)";
        element.style.boxShadow =
          "0 0 0 4px rgba(249, 115, 22, 0.4), 0 4px 16px rgba(0,0,0,0.5)";
        element.style.zIndex = "1000";
      } else {
        // Reset to normal state
        element.style.transform = "scale(1)";
        element.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        element.style.zIndex = "1";
      }
    });
  }, [selectedLocation]);

  if (tokenLoading) {
    return (
      <div className="w-full h-full bg-card border border-border flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  if (tokenError || !savedToken) {
    return (
      <div className="w-full h-full bg-card border border-border flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-4">
          <p className="text-foreground font-medium mb-2">{tokenError || "Mapbox token not configured"}</p>
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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {debugEnabled && (
        <div className="absolute left-3 top-3 z-20 w-[320px] rounded-lg border border-border bg-card/95 p-3 text-xs text-card-foreground shadow-lg backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="font-semibold">Map debug</div>
            <div className="text-muted-foreground">?mapDebug=1</div>
          </div>
          {!debugInfo ? (
            <div className="mt-2 text-muted-foreground">
              Waiting for markers…
            </div>
          ) : (
            <div className="mt-2 space-y-1">
              <div className="text-muted-foreground">First marker</div>
              <div className="font-medium leading-snug">{debugInfo.name}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div>
                  <span className="text-muted-foreground">zoom</span>: {debugInfo.zoom.toFixed(2)}
                </div>
                <div>
                  <span className="text-muted-foreground">id</span>: {debugInfo.id.slice(0, 8)}…
                </div>
                <div>
                  <span className="text-muted-foreground">lat</span>: {debugInfo.lat.toFixed(6)}
                </div>
                <div>
                  <span className="text-muted-foreground">lng</span>: {debugInfo.lng.toFixed(6)}
                </div>
                <div>
                  <span className="text-muted-foreground">dx</span>: {debugInfo.dx.toFixed(2)}px
                </div>
                <div>
                  <span className="text-muted-foreground">dy</span>: {debugInfo.dy.toFixed(2)}px
                </div>
              </div>
              <div className="mt-2 text-muted-foreground">
                If dx/dy isn’t near ~0px, we’ve got a consistent offset we can correct.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;

