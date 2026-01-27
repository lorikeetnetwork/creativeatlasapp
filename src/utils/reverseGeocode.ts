// Reverse geocoding utility using Mapbox API
const MAPBOX_TOKEN = "pk.eyJ1IjoibG9yaWtlZXRuZXR3b3JrIiwiYSI6ImNtaThya2R6bDBmNnQyaXBydDV6dGdocjgifQ.iGQZTbQ3tP_hHIQQcae9Qw";

export interface ReverseGeocodeResult {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=address,locality,place,region,postcode&country=AU`
    );
    
    if (!response.ok) {
      console.error("Reverse geocode failed:", response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return null;
    }

    // Parse the result to extract address components
    const feature = data.features[0];
    const context = feature.context || [];
    
    let address = feature.place_name || "";
    let suburb = "";
    let state = "";
    let postcode = "";
    let country = "Australia";

    // Extract components from context
    for (const ctx of context) {
      if (ctx.id.startsWith("locality") || ctx.id.startsWith("place")) {
        suburb = ctx.text;
      } else if (ctx.id.startsWith("region")) {
        state = ctx.short_code?.replace("AU-", "") || ctx.text;
      } else if (ctx.id.startsWith("postcode")) {
        postcode = ctx.text;
      } else if (ctx.id.startsWith("country")) {
        country = ctx.text;
      }
    }

    // If no suburb found, try to extract from place_name
    if (!suburb && feature.text) {
      suburb = feature.text;
    }

    // Clean up address - remove the country part if present
    address = address.replace(/, Australia$/, "");
    
    // If address is too long, try to shorten it
    if (address.length > 100) {
      const parts = address.split(", ");
      address = parts.slice(0, 3).join(", ");
    }

    return {
      address,
      suburb,
      state,
      postcode,
      country,
    };
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
}
