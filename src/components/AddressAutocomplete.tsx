import { useEffect, useRef, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Input } from "@/components/ui/input";

interface AddressAutocompleteProps {
  onAddressSelect: (address: ParsedAddress) => void;
  placeholder?: string;
  defaultValue?: string;
}

export interface ParsedAddress {
  address: string;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Start typing an address...",
  defaultValue = "",
}: AddressAutocompleteProps) {
  const geocoderContainer = useRef<HTMLDivElement>(null);
  const geocoderInstance = useRef<MapboxGeocoder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [savedToken, setSavedToken] = useState<string | null>(
    import.meta.env.VITE_MAPBOX_TOKEN || localStorage.getItem("mapbox_token") || null
  );

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setSavedToken(tokenInput.trim());
      setTokenInput("");
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!geocoderContainer.current || geocoderInstance.current) return;

    if (!savedToken) {
      setError("Mapbox token not configured");
      return;
    }

    try {
      const geocoder = new MapboxGeocoder({
        accessToken: savedToken,
        types: "address",
        countries: "au",
        placeholder: placeholder,
        autocomplete: true,
        minLength: 3,
      });

      geocoder.addTo(geocoderContainer.current);
      geocoderInstance.current = geocoder;

      // Handle address selection
      geocoder.on("result", (e) => {
        const feature = e.result;
        const parsedAddress = parseMapboxAddress(feature);
        onAddressSelect(parsedAddress);
      });

      // Set default value if provided
      if (defaultValue) {
        geocoder.setInput(defaultValue);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to initialize geocoder:", err);
      setError("Failed to initialize address search");
    }

    return () => {
      if (geocoderInstance.current) {
        geocoderInstance.current.clear();
      }
    };
  }, [savedToken, placeholder, onAddressSelect, defaultValue]);

  const parseMapboxAddress = (feature: any): ParsedAddress => {
    const context = feature.context || [];
    
    // Extract address components from the context array
    const locality = context.find((c: any) => c.id.includes("locality"))?.text || "";
    const place = context.find((c: any) => c.id.includes("place"))?.text || "";
    const postcode = context.find((c: any) => c.id.includes("postcode"))?.text || "";
    const region = context.find((c: any) => c.id.includes("region"))?.text || "";
    const country = context.find((c: any) => c.id.includes("country"))?.text || "Australia";

    // Get street address - use the main text or first part of place_name
    const address = feature.text || feature.place_name.split(",")[0] || "";
    
    // Suburb is usually the locality or place
    const suburb = locality || place || "";

    return {
      address,
      suburb,
      postcode,
      state: region,
      country,
      latitude: feature.center[1],
      longitude: feature.center[0],
    };
  };

  if (error) {
    return (
      <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/50">
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground">
          Enter your Mapbox public token to enable address search
        </p>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="pk.your_mapbox_token_here"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 h-9"
          />
          <button
            type="button"
            onClick={handleSaveToken}
            disabled={!tokenInput.trim()}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="address-autocomplete-wrapper">
      <div ref={geocoderContainer} />
      <style>{`
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder {
          width: 100%;
          max-width: 100%;
          box-shadow: none;
          font-family: inherit;
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--input {
          height: 2.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--input));
          border-radius: calc(var(--radius) - 2px);
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--input:focus {
          outline: none;
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--icon {
          fill: hsl(var(--muted-foreground));
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--button {
          background: transparent;
        }
        
        .address-autocomplete-wrapper .suggestions-wrapper {
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 50;
        }
        
        .address-autocomplete-wrapper .suggestions {
          background: hsl(var(--popover));
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--suggestion {
          color: hsl(var(--popover-foreground));
          padding: 0.5rem 0.75rem;
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--suggestion:hover,
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--suggestion.active {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--suggestion-title {
          color: hsl(var(--foreground));
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--suggestion-address {
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
        }
        
        .address-autocomplete-wrapper .mapboxgl-ctrl-geocoder--powered-by {
          display: none;
        }
      `}</style>
    </div>
  );
}
