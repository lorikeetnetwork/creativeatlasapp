import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface StaticMapPreviewProps {
  latitude: number;
  longitude: number;
  name: string;
}

export default function StaticMapPreview({ latitude, longitude, name }: StaticMapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || localStorage.getItem('mapbox_token');
    
    if (!mapboxToken) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

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
  }, [latitude, longitude, name]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
