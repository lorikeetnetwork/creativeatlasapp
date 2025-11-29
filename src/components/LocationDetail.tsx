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
const LocationDetail = ({
  location,
  onClose
}: LocationDetailProps) => {
  const [photos, setPhotos] = useState<any[]>([]);
  useEffect(() => {
    if (location?.id) {
      fetchPhotos();
    }
  }, [location?.id]);
  const fetchPhotos = async () => {
    if (!location) return;
    try {
      const {
        data,
        error
      } = await supabase.from('location_photos').select('*').eq('location_id', location.id).order('display_order');
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };
  if (!location) return null;
  return <Card className="flex flex-col shadow-lg border-border/50 bg-card max-h-full overflow-hidden">
      <CardHeader className="flex-shrink-0 border-b p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base leading-tight truncate">{location.name}</CardTitle>
            <div className="flex flex-wrap gap-1">
              <Badge className="bg-primary text-primary-foreground text-xs">{location.category}</Badge>
              {location.subcategory && <Badge variant="outline" className="text-xs">{location.subcategory}</Badge>}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="p-3 space-y-3 bg-[#e3e3e3]">
          {/* Photo Gallery */}
          {photos.length > 0 && <PhotoGallery photos={photos} />}

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <p>{location.address}</p>
              <p className="text-muted-foreground">
                {location.suburb}, {location.state} {location.postcode}
              </p>
            </div>
          </div>

          {/* Description */}
          {location.description && <div className="space-y-1">
              <h4 className="text-xs font-semibold">About</h4>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {location.description}
              </p>
            </div>}

          {/* Best For */}
          {location.best_for && <div className="space-y-1">
              <h4 className="text-xs font-semibold">Best For</h4>
              <p className="text-xs text-muted-foreground">{location.best_for}</p>
            </div>}

          {/* Capacity & Accessibility Row */}
          {(location.capacity || location.accessibility_notes) && <div className="flex flex-wrap gap-3 text-xs">
              {location.capacity && <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">{location.capacity} people</span>
                </div>}
              {location.accessibility_notes && <div className="flex items-center gap-1.5">
                  <Accessibility className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground truncate max-w-[150px]">{location.accessibility_notes}</span>
                </div>}
            </div>}

          {/* Contact & Social */}
          {(location.website || location.email || location.phone || location.instagram) && <div className="space-y-1.5">
              <h4 className="text-xs font-semibold">Contact</h4>
              <div className="flex flex-wrap gap-2">
                {location.website && <a href={location.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                    <Globe className="w-3 h-3" />
                    <span className="underline">Website</span>
                  </a>}
                {location.email && <a href={`mailto:${location.email}`} className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>}
                {location.phone && <a href={`tel:${location.phone}`} className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>}
                {location.instagram && <a href={`https://instagram.com/${location.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                    <Instagram className="w-3 h-3" />
                    <span>Instagram</span>
                  </a>}
              </div>
            </div>}

          {/* Source Attribution */}
          {location.source === "UserSubmitted" && <div className="pt-2 border-t">
              <p className="text-[10px] text-muted-foreground italic">
                Listing provided by the business/artist
              </p>
            </div>}
        </CardContent>
      </ScrollArea>
    </Card>;
};
export default LocationDetail;