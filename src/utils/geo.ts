export type Coordinates = { lat: number; lng: number };

function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export function normalizeCoordinates(input: {
  latitude: number | string;
  longitude: number | string;
}): Coordinates {
  const latitude = toNumber(input.latitude);
  const longitude = toNumber(input.longitude);

  // If anything is NaN, return 0/0 so it's obvious in debugging (and won't crash Mapbox).
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { lat: 0, lng: 0 };
  }

  // If latitude is outside valid range but longitude looks like a latitude, swap.
  // Helps when data was saved as (lng, lat) by mistake.
  const latLooksInvalid = Math.abs(latitude) > 90;
  const lngLooksLikeLat = Math.abs(longitude) <= 90;

  if (latLooksInvalid && lngLooksLikeLat) {
    return { lat: longitude, lng: latitude };
  }

  return { lat: latitude, lng: longitude };
}

