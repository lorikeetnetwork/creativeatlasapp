export type Coordinates = { lat: number; lng: number };

export function normalizeCoordinates(input: { latitude: number; longitude: number }): Coordinates {
  const { latitude, longitude } = input;

  // If latitude is outside valid range but longitude looks like a latitude, swap.
  // Helps when data was saved as (lng, lat) by mistake.
  const latLooksInvalid = Math.abs(latitude) > 90;
  const lngLooksLikeLat = Math.abs(longitude) <= 90;

  if (latLooksInvalid && lngLooksLikeLat) {
    return { lat: longitude, lng: latitude };
  }

  return { lat: latitude, lng: longitude };
}
