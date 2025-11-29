import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Mail, Phone, Instagram, Users, Accessibility, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { PhotoGallery } from "./PhotoGallery";
import { useNavigate } from "react-router-dom";

interface MobileLocationDetailProps {
  location: Tables<"locations"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileLocationDetail = ({ location, open, onOpenChange }: MobileLocationDetailProps) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const navigate = useNavigate();

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl bg-card overflow-hidden">
        <SheetHeader className="pb-4 border-b">
          <div className="space-y-2">
            <SheetTitle className="text-left text-lg leading-tight">{location.name}</SheetTitle>
            <div className="flex flex-wrap gap-1.5">
              <Badge className="bg-primary text-primary-foreground text-xs">{location.category}</Badge>
              {location.subcategory && <Badge variant="outline" className="text-xs">{location.subcategory}</Badge>}
            </div>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100%-5rem)] py-4 space-y-4 scrollbar-hide">
          {/* Photo Gallery */}
          {photos.length > 0 && <PhotoGallery photos={photos} />}

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">{location.address}</p>
              <p className="text-muted-foreground">
                {location.suburb}, {location.state} {location.postcode}
              </p>
            </div>
          </div>

          {/* Description */}
          {location.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">About</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {location.description}
              </p>
            </div>
          )}

          {/* Best For */}
          {location.best_for && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Best For</h4>
              <p className="text-sm text-muted-foreground">{location.best_for}</p>
            </div>
          )}

          {/* Capacity & Accessibility */}
          {(location.capacity || location.accessibility_notes) && (
            <div className="flex flex-wrap gap-4 text-sm">
              {location.capacity && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{location.capacity} people</span>
                </div>
              )}
              {location.accessibility_notes && (
                <div className="flex items-center gap-2">
                  <Accessibility className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{location.accessibility_notes}</span>
                </div>
              )}
            </div>
          )}

          {/* Contact Links */}
          {(location.website || location.email || location.phone || location.instagram) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Contact</h4>
              <div className="grid grid-cols-2 gap-2">
                {location.website && (
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-primary" />
                    <span>Website</span>
                  </a>
                )}
                {location.email && (
                  <a
                    href={`mailto:${location.email}`}
                    className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Email</span>
                  </a>
                )}
                {location.phone && (
                  <a
                    href={`tel:${location.phone}`}
                    className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span>Call</span>
                  </a>
                )}
                {location.instagram && (
                  <a
                    href={`https://instagram.com/${location.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-primary" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* View Full Profile Button */}
          <Button
            className="w-full"
            onClick={() => navigate(`/business/${location.id}`)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Profile
          </Button>

          {/* Source Attribution */}
          {location.source === "UserSubmitted" && (
            <p className="text-xs text-muted-foreground italic text-center pt-2">
              Listing provided by the business/artist
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileLocationDetail;
