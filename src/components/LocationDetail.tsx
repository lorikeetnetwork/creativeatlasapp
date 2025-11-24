import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Mail, Phone, Instagram, X, Users, Accessibility } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { PhotoGallery } from "./PhotoGallery";

interface LocationDetailProps {
  location: Tables<"locations"> | null;
  onClose: () => void;
}

const LocationDetail = ({ location, onClose }: LocationDetailProps) => {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (location?.id) {
      fetchPhotos();
    }
  }, [location?.id]);

  const fetchPhotos = async () => {
    if (!location) return;
    
    try {
      const { data, error } = await supabase
        .from('location_photos')
        .select('*')
        .eq('location_id', location.id)
        .order('display_order');

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  if (!location) return null;

  return (
    <Card className="h-full flex flex-col shadow-warm">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-2xl leading-tight">{location.name}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary text-primary-foreground">{location.category}</Badge>
              {location.subcategory && (
                <Badge variant="outline">{location.subcategory}</Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="p-6 space-y-6">
          {/* Photo Gallery */}
          {photos.length > 0 && (
            <PhotoGallery photos={photos} />
          )}

          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p>{location.address}</p>
                <p className="text-muted-foreground">
                  {location.suburb}, {location.state} {location.postcode}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {location.description && (
            <div className="space-y-2">
              <h4 className="font-semibold">About</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {location.description}
              </p>
            </div>
          )}

          {/* Best For */}
          {location.best_for && (
            <div className="space-y-2">
              <h4 className="font-semibold">Best For</h4>
              <p className="text-sm text-muted-foreground">{location.best_for}</p>
            </div>
          )}

          {/* Capacity */}
          {location.capacity && (
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">{location.capacity} people</p>
              </div>
            </div>
          )}

          {/* Accessibility */}
          {location.accessibility_notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Accessibility</h4>
              </div>
              <p className="text-sm text-muted-foreground">{location.accessibility_notes}</p>
            </div>
          )}

          {/* Contact & Social */}
          <div className="space-y-3">
            <h4 className="font-semibold">Contact & Links</h4>
            <div className="space-y-2">
              {location.website && (
                <a
                  href={location.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="underline">Visit Website</span>
                </a>
              )}
              {location.email && (
                <a
                  href={`mailto:${location.email}`}
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{location.email}</span>
                </a>
              )}
              {location.phone && (
                <a
                  href={`tel:${location.phone}`}
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{location.phone}</span>
                </a>
              )}
              {location.instagram && (
                <a
                  href={`https://instagram.com/${location.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{location.instagram.replace('@', '')}</span>
                </a>
              )}
            </div>
          </div>

          {/* Source Attribution */}
          {location.source === "UserSubmitted" && (
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground italic">
                Listing provided by the business/artist
              </p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default LocationDetail;
