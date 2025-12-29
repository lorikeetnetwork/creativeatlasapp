import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMapboxToken } from "@/hooks/useMapboxToken";

interface StaticMapPreviewProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function StaticMapPreview({ latitude, longitude, name }: StaticMapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { token, loading } = useMapboxToken();

  useEffect(() => {
    if (!mapContainer.current || map.current || loading || !token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 14,
      interactive: false,
    });

    new mapboxgl.Marker({ color: '#FF6B6B' })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${name}</strong>`))
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, name, token, loading]);

  if (loading) {
    return <div className="w-full h-full bg-muted animate-pulse" />;
  }

  if (!token) {
    return <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">Map unavailable</div>;
  }

  return <div ref={mapContainer} className="w-full h-full" />;
}
