import { useEffect, useMemo, useRef, useState } from "react";
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
  isAddMode?: boolean;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  tempMarkerCoords?: { lat: number; lng: number } | null;
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
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }

      // Enable terrain with exaggeration
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Add 3D building extrusions
      if (!map.getLayer("3d-buildings")) {
        // Find a good label layer to insert before
        const layers = map.getStyle()?.layers || [];
        let labelLayerId: string | undefined;
        for (const layer of layers) {
          if (layer.type === "symbol" && (layer as any).layout?.["text-field"]) {
            labelLayerId = layer.id;
            break;
          }
        }

        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                "#ddd",
                50,
                "#ccc",
                100,
                "#bbb",
                200,
                "#aaa",
              ],
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.8,
            },
          },
          labelLayerId
        );
      }

      // Add sky layer for atmosphere
      if (!map.getLayer("sky")) {
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15,
          },
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
    if (map.getLayer("sky")) {
      map.removeLayer("sky");
    }
    if (map.getLayer("3d-buildings")) {
      map.removeLayer("3d-buildings");
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

      allLayers.forEach((layer) => {
        try {
          // Background layer
          if (layer.type === "background") {
            map.setPaintProperty(
              layer.id,
              "background-color",
              BLUEPRINT_COLORS.background
            );
          }
          // Fill layers (water, land, buildings, parks)
          else if (layer.type === "fill") {
            if (layer.id.includes("water")) {
              map.setPaintProperty(layer.id, "fill-color", BLUEPRINT_COLORS.water);
            } else if (layer.id.includes("building")) {
              map.setPaintProperty(
                layer.id,
                "fill-color",
                BLUEPRINT_COLORS.buildings
              );
              map.setPaintProperty(
                layer.id,
                "fill-outline-color",
                BLUEPRINT_COLORS.roads
              );
            } else if (
              layer.id.includes("land") ||
              layer.id.includes("park") ||
              layer.id.includes("grass") ||
              layer.id.includes("national")
            ) {
              map.setPaintProperty(layer.id, "fill-color", BLUEPRINT_COLORS.land);
            }
          }
          // Line layers (roads, borders, paths)
          else if (layer.type === "line") {
            if (
              layer.id.includes("road") ||
              layer.id.includes("tunnel") ||
              layer.id.includes("bridge") ||
              layer.id.includes("path") ||
              layer.id.includes("street") ||
              layer.id.includes("motorway") ||
              layer.id.includes("trunk") ||
              layer.id.includes("link")
            ) {
              map.setPaintProperty(layer.id, "line-color", BLUEPRINT_COLORS.roads);
              map.setPaintProperty(layer.id, "line-opacity", 0.8);
            } else if (
              layer.id.includes("boundary") ||
              layer.id.includes("admin") ||
              layer.id.includes("border")
            ) {
              map.setPaintProperty(layer.id, "line-color", BLUEPRINT_COLORS.borders);
              map.setPaintProperty(layer.id, "line-opacity", 0.6);
            }
          }
          // Symbol layers (labels, icons)
          else if (layer.type === "symbol") {
            map.setPaintProperty(layer.id, "text-color", BLUEPRINT_COLORS.labels);
            map.setPaintProperty(
              layer.id,
              "text-halo-color",
              BLUEPRINT_COLORS.background
            );
            map.setPaintProperty(layer.id, "text-halo-width", 1);
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

const SOURCE_ID = "locations-src";
const LAYER_ID = "locations-layer";
const LAYER_SELECTED_ID = "locations-selected-layer";

function getMarkerColor(
  location: Tables<"locations">,
  colorMode: MarkerColorMode
): string {
  switch (colorMode) {
    case "mono":
      return MONO_COLOR;
    case "highContrast":
      return HIGH_CONTRAST_COLOR;
    default:
      return getCategoryColor(location.category);
  }
}

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
  isAddMode = false,
  onMapClick,
  tempMarkerCoords,
}: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const hasInitiallyFitBounds = useRef(false);
  const initialLocationsRef = useRef<Tables<"locations">[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleReady, setStyleReady] = useState(false);

  // Store first non-empty locations for initial bounds fit
  if (locations.length > 0 && initialLocationsRef.current.length === 0) {
    initialLocationsRef.current = locations;
  }

  const [tokenInput, setTokenInput] = useState("");
  const {
    token: savedToken,
    loading: tokenLoading,
    error: tokenError,
    saveToken,
  } = useMapboxToken();

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      saveToken(tokenInput.trim());
      mapboxgl.accessToken = tokenInput.trim();
      setTokenInput("");
      window.location.reload();
    }
  };

  const geoJson = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: locations.map((location) => {
        const { lat, lng } = normalizeCoordinates({
          latitude: location.latitude as unknown as number,
          longitude: location.longitude as unknown as number,
        });

        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [lng, lat] as [number, number],
          },
          properties: {
            id: location.id,
            name: location.name,
            color: getMarkerColor(location, colorMode),
            isFavorite: favoriteIds.has(location.id) ? 1 : 0,
          },
        };
      }),
    };
  }, [locations, colorMode, favoriteIds]);

  const ensureLayers = (m: mapboxgl.Map) => {
    // Source
    const existingSource = m.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    if (!existingSource) {
      m.addSource(SOURCE_ID, {
        type: "geojson",
        data: geoJson,
      });
    } else {
      existingSource.setData(geoJson);
    }

    // Base layer
    if (!m.getLayer(LAYER_ID)) {
      m.addLayer({
        id: LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": 10,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 2,
          "circle-stroke-color": [
            "case",
            ["==", ["get", "isFavorite"], 1],
            "#ef4444",
            "#ffffff",
          ],
          "circle-opacity": 0.95,
        },
      });
    }

    // Selected layer (drawn above)
    if (!m.getLayer(LAYER_SELECTED_ID)) {
      m.addLayer({
        id: LAYER_SELECTED_ID,
        type: "circle",
        source: SOURCE_ID,
        filter: ["==", ["get", "id"], ""],
        paint: {
          "circle-radius": 14,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 4,
          "circle-stroke-color": "#f97316",
          "circle-opacity": 1,
        },
      });
    }

    // Interaction
    m.off("click", LAYER_ID, onLayerClick);
    m.on("click", LAYER_ID, onLayerClick);

    m.off("mouseenter", LAYER_ID, onLayerEnter);
    m.off("mouseleave", LAYER_ID, onLayerLeave);

    m.on("mouseenter", LAYER_ID, onLayerEnter);
    m.on("mouseleave", LAYER_ID, onLayerLeave);
  };

  // Keep handler stable (Mapbox requires the same reference for off/on)
  const onLayerClick = (e: any) => {
    const feature = e.features?.[0];
    const id = feature?.properties?.id as string | undefined;
    if (!id) return;

    const found = locations.find((l) => l.id === id);
    if (found) onLocationSelect(found);
  };

  const onLayerEnter = () => {
    if (!map.current) return;
    map.current.getCanvas().style.cursor = "pointer";
  };

  const onLayerLeave = () => {
    if (!map.current) return;
    map.current.getCanvas().style.cursor = "";
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

      // Handle map clicks for add mode
      map.current.on("click", (e) => {
        if (isAddMode && onMapClick) {
          onMapClick({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          });
        }
      });

      // Mark style as ready whenever the map becomes idle (covers style changes too)
      map.current.on("idle", () => {
        setStyleReady(true);
      });

      // Handle style changes - re-add source/layers once style is ready
      map.current.on("style.load", () => {
        setStyleReady(true);

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
      const m = map.current;
      if (m) {
        try {
          m.off("click", LAYER_ID, onLayerClick);
          m.off("mouseenter", LAYER_ID, onLayerEnter);
          m.off("mouseleave", LAYER_ID, onLayerLeave);
        } catch {
          // ignore
        }
      }
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle style changes - set styleReady to false during transition
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    setStyleReady(false);

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

  // Ensure/update source + layers whenever data changes (and after style changes)
  useEffect(() => {
    if (!map.current || !mapLoaded || !styleReady) return;

    try {
      ensureLayers(map.current);
    } catch (e) {
      console.warn("Could not set location layers:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, styleReady, geoJson]);

  // Update selected feature filter
  useEffect(() => {
    if (!map.current || !mapLoaded || !styleReady) return;
    const m = map.current;

    const selectedId = selectedLocation?.id ?? "";
    if (m.getLayer(LAYER_SELECTED_ID)) {
      m.setFilter(LAYER_SELECTED_ID, ["==", ["get", "id"], selectedId]);
    }
  }, [selectedLocation, mapLoaded, styleReady]);

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
  }, [mapLoaded]);

  // Handle cursor change for add mode - must be before conditional returns
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const canvas = map.current.getCanvas();
    if (isAddMode) {
      canvas.style.cursor = "crosshair";
    } else {
      canvas.style.cursor = "";
    }
  }, [isAddMode, mapLoaded]);

  // Handle temporary marker for add mode - must be before conditional returns
  const tempMarkerRef = useRef<mapboxgl.Marker | null>(null);
  
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Remove existing temp marker
    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }
    
    // Add new temp marker if coords provided
    if (tempMarkerCoords) {
      const el = document.createElement("div");
      el.className = "temp-add-marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#22c55e";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      
      tempMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([tempMarkerCoords.lng, tempMarkerCoords.lat])
        .addTo(map.current);
    }
    
    return () => {
      if (tempMarkerRef.current) {
        tempMarkerRef.current.remove();
        tempMarkerRef.current = null;
      }
    };
  }, [tempMarkerCoords, mapLoaded]);

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
          <p className="text-foreground font-medium mb-2">
            {tokenError || "Mapbox token not configured"}
          </p>
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
              href="https://mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className={`w-full h-full ${isAddMode ? "cursor-crosshair" : ""}`} />

      {/* Map Controls */}
      {(onStyleChange || onColorModeChange) && (
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur border border-border rounded-lg p-4 space-y-3 shadow-lg">
          {onStyleChange && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Map Style</p>
              <div className="grid grid-cols-2 gap-1">
                {(
                  [
                    "dark",
                    "light",
                    "streets",
                    "outdoors",
                    "satellite",
                    "blueprint",
                    "3d",
                    "satellite-3d",
                  ] as MapStyle[]
                ).map((style) => (
                  <Button
                    key={style}
                    variant={mapStyle === style ? "default" : "outline"}
                    size="sm"
                    onClick={() => onStyleChange(style)}
                    className="text-xs"
                  >
                    {style.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {onColorModeChange && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Marker Colors</p>
              <div className="flex gap-1">
                {(
                  ["category", "mono", "highContrast"] as MarkerColorMode[]
                ).map((mode) => (
                  <Button
                    key={mode}
                    variant={colorMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => onColorModeChange(mode)}
                    className="text-xs"
                  >
                    {mode === "highContrast" ? "High" : mode}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;
