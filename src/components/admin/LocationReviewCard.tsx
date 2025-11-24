import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StaticMapPreview from "@/components/StaticMapPreview";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trash2, ExternalLink } from "lucide-react";

interface LocationReviewCardProps {
  location: any;
  onClose: () => void;
  onUpdate: () => void;
}

export function LocationReviewCard({ location, onClose, onUpdate }: LocationReviewCardProps) {
  const [photos, setPhotos] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, [location.id]);

  const fetchPhotos = async () => {
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

  const handleStatusChange = async (newStatus: 'Active' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ status: newStatus })
        .eq('id', location.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Location ${newStatus.toLowerCase()} successfully.`,
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update location status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', location.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Location deleted successfully.",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error deleting location:", error);
      toast({
        title: "Error",
        description: "Failed to delete location.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {location.name}
            <Badge>{location.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Map Preview */}
          <div className="h-48 rounded-lg overflow-hidden">
            <StaticMapPreview
              latitude={location.latitude}
              longitude={location.longitude}
              name={location.name}
            />
          </div>

          {/* Logo */}
          {location.logo_url && (
            <div>
              <h3 className="font-semibold mb-2">Logo</h3>
              <img
                src={location.logo_url}
                alt={location.name}
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Photos ({photos.length})</h3>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || "Location photo"}
                      className="w-full h-24 object-cover rounded"
                    />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p>{location.category}</p>
              </div>
              {location.subcategory && (
                <div>
                  <span className="text-muted-foreground">Subcategory:</span>
                  <p>{location.subcategory}</p>
                </div>
              )}
              {location.capacity && (
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <p>{location.capacity} people</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {location.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{location.description}</p>
            </div>
          )}

          <Separator />

          {/* Address */}
          <div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p className="text-sm">
              {location.address}<br />
              {location.suburb}, {location.state} {location.postcode}<br />
              {location.country}
            </p>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <div className="space-y-2 text-sm">
              {location.email && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20">Email:</span>
                  <a href={`mailto:${location.email}`} className="text-primary hover:underline">
                    {location.email}
                  </a>
                </div>
              )}
              {location.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20">Phone:</span>
                  <a href={`tel:${location.phone}`} className="text-primary hover:underline">
                    {location.phone}
                  </a>
                </div>
              )}
              {location.website && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20">Website:</span>
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {location.website} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {location.instagram && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-20">Instagram:</span>
                  <a
                    href={`https://instagram.com/${location.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {location.instagram}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          {(location.best_for || location.accessibility_notes) && (
            <>
              <Separator />
              <div className="space-y-4">
                {location.best_for && (
                  <div>
                    <h3 className="font-semibold mb-2">Best For</h3>
                    <p className="text-sm text-muted-foreground">{location.best_for}</p>
                  </div>
                )}
                {location.accessibility_notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Accessibility Notes</h3>
                    <p className="text-sm text-muted-foreground">{location.accessibility_notes}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          {location.status !== 'Rejected' && (
            <Button
              variant="destructive"
              onClick={() => handleStatusChange('Rejected')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          )}
          {location.status !== 'Active' && (
            <Button
              variant="default"
              onClick={() => handleStatusChange('Active')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
