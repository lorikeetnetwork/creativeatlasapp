import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { reverseGeocode } from "@/utils/reverseGeocode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Loader2, Check, Plus, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type LocationCategory = Database["public"]["Enums"]["location_category"];

// The 12 core parent categories used in the app
const CATEGORIES: string[] = [
  "Music Industry",
  "Audio, Production & Post-Production",
  "Visual Arts, Design & Craft",
  "Culture, Heritage & Community",
  "Events, Festivals & Live Performance",
  "Media, Content & Communications",
  "Education, Training & Professional Development",
  "Workspaces, Fabrication & Creative Infrastructure",
  "Creative Technology & Emerging Media",
  "Software, Development & Digital Platforms",
  "Media Infrastructure & Cloud Technology",
  "Business, Logistics & Support Services",
];

const quickAddSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  address: z.string().min(1, "Address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().default("Australia"),
  latitude: z.number(),
  longitude: z.number(),
  website: z.string().url().optional().or(z.literal("")),
  status: z.enum(["Active", "Pending"]).default("Active"),
});

type QuickAddFormData = z.infer<typeof quickAddSchema>;

interface QuickAddLocationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: { lat: number; lng: number } | null;
  onSuccess?: () => void;
  onClickMap?: () => void;
}

export function QuickAddLocation({
  open,
  onOpenChange,
  coordinates,
  onSuccess,
  onClickMap,
}: QuickAddLocationProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [continueAdding, setContinueAdding] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuickAddFormData>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: {
      country: "Australia",
      status: "Active",
    },
  });

  const watchedCoords = {
    lat: watch("latitude"),
    lng: watch("longitude"),
  };

  // When coordinates change (from map click), reverse geocode
  useEffect(() => {
    if (coordinates) {
      setValue("latitude", coordinates.lat);
      setValue("longitude", coordinates.lng);
      
      setIsLoadingAddress(true);
      reverseGeocode(coordinates.lat, coordinates.lng)
        .then((result) => {
          if (result) {
            setValue("address", result.address);
            setValue("suburb", result.suburb);
            setValue("state", result.state);
            setValue("postcode", result.postcode);
            setValue("country", result.country);
          }
        })
        .finally(() => setIsLoadingAddress(false));
    }
  }, [coordinates, setValue]);

  const resetForm = () => {
    reset({
      name: "",
      category: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      country: "Australia",
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number,
      website: "",
      status: "Active",
    });
  };

  const onSubmit = async (data: QuickAddFormData) => {
    setIsSubmitting(true);
    
    try {
      // Use any to bypass strict type checking for the category enum
      const insertData = {
        name: data.name,
        category: data.category,
        address: data.address,
        suburb: data.suburb,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        website: data.website || null,
        status: data.status,
        source: "AdminAdded",
        owner_user_id: null,
      };
      
      const { error } = await supabase
        .from("locations")
        .insert(insertData as any);

      if (error) throw error;

      toast({
        title: "Location added!",
        description: `"${data.name}" has been added to the map.`,
      });

      if (continueAdding) {
        resetForm();
        onClickMap?.();
      } else {
        onOpenChange(false);
        resetForm();
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding location:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add location",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            Quick Add Location
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Location name"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select onValueChange={(val) => setValue("category", val)}>
              <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border max-h-60">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Coordinates Display */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              Coordinates
              {isLoadingAddress && <Loader2 className="w-3 h-3 animate-spin" />}
              {watchedCoords.lat && !isLoadingAddress && (
                <Check className="w-3 h-3 text-green-500" />
              )}
            </Label>
            {watchedCoords.lat ? (
              <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded border">
                {watchedCoords.lat.toFixed(6)}, {watchedCoords.lng.toFixed(6)}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onClickMap}
                className="w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Click on map to set location
              </Button>
            )}
          </div>

          {/* Address (auto-filled from reverse geocode) */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="Street address"
              {...register("address")}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>

          {/* Suburb, State, Postcode in a row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb *</Label>
              <Input
                id="suburb"
                placeholder="Suburb"
                {...register("suburb")}
                className={errors.suburb ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="State"
                {...register("state")}
                className={errors.state ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                placeholder="Postcode"
                {...register("postcode")}
                className={errors.postcode ? "border-destructive" : ""}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              defaultValue="Active"
              onValueChange={(val) => setValue("status", val as "Active" | "Pending")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Active" id="active" />
                <Label htmlFor="active" className="cursor-pointer font-normal">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Pending" id="pending" />
                <Label htmlFor="pending" className="cursor-pointer font-normal">Pending</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Website (optional) */}
          <div className="space-y-2">
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://..."
              {...register("website")}
              className={errors.website ? "border-destructive" : ""}
            />
            {errors.website && (
              <p className="text-xs text-destructive">{errors.website.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !watchedCoords.lat}
              className="flex-1"
              onClick={() => setContinueAdding(false)}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Add Location
            </Button>
          </div>
          
          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting || !watchedCoords.lat}
            className="w-full"
            onClick={() => setContinueAdding(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add & Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
