import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Upload, Loader2, X, MapPin } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import AddressAutocomplete, { type ParsedAddress } from "./AddressAutocomplete";

const CATEGORIES = [
  "Venue",
  "Gallery",
  "Studio",
  "Workshop",
  "Performance Space",
  "Co-working",
  "Maker Space",
  "Retail",
  "Other"
] as const;

const STATES = ["QLD", "NSW", "VIC", "SA", "WA", "TAS", "NT", "ACT"] as const;

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  address: z.string().min(1, "Address is required").max(200),
  suburb: z.string().min(1, "Suburb is required").max(100),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required").max(10),
  country: z.string().min(1).max(100).default("Australia"),
  email: z.string().email("Invalid email").max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  website: z.string().url("Invalid URL").max(255).optional().or(z.literal("")),
  instagram: z.string().max(100).optional(),
  other_social: z.string().max(255).optional(),
  capacity: z.number().int().positive().optional().or(z.literal(undefined)),
  best_for: z.string().max(500).optional(),
  accessibility_notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LocationSubmissionFormProps {
  session: Session | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LocationSubmissionForm({ session, onSuccess, onCancel }: LocationSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "Australia",
      state: "QLD",
    }
  });

  const handleAddressSelect = (parsedAddress: ParsedAddress) => {
    setValue("address", parsedAddress.address);
    setValue("suburb", parsedAddress.suburb);
    setValue("state", parsedAddress.state);
    setValue("postcode", parsedAddress.postcode);
    setValue("country", parsedAddress.country);
    setCoordinates({
      latitude: parsedAddress.latitude,
      longitude: parsedAddress.longitude,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const geocodeAddress = async (address: string, suburb: string, state: string, postcode: string, country: string) => {
    try {
      const fullAddress = `${address}, ${suburb}, ${state} ${postcode}, ${country}`;
      const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxToken}&limit=1`
      );
      
      if (!response.ok) throw new Error("Geocoding failed");
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      }
      
      throw new Error("No coordinates found");
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const uploadLogo = async (locationId: string) => {
    if (!logoFile || !session?.user?.id) return null;

    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${session.user.id}/${locationId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('location-logos')
      .upload(filePath, logoFile);

    if (uploadError) {
      console.error("Logo upload error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('location-logos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a location",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use coordinates from autocomplete or geocode manually entered address
      let finalCoordinates = coordinates;
      
      if (!finalCoordinates) {
        finalCoordinates = await geocodeAddress(
          data.address,
          data.suburb,
          data.state,
          data.postcode,
          data.country
        );
      }

      if (!finalCoordinates) {
        toast({
          title: "Address not found",
          description: "Could not find coordinates for this address. Please check the address details.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert location first without logo
      const { data: insertedData, error: insertError } = await supabase
        .from('locations')
        .insert({
          name: data.name,
          category: data.category as any,
          subcategory: data.subcategory || null,
          description: data.description || null,
          address: data.address,
          suburb: data.suburb,
          state: data.state,
          postcode: data.postcode,
          country: data.country,
          latitude: finalCoordinates.latitude,
          longitude: finalCoordinates.longitude,
          email: data.email || null,
          phone: data.phone || null,
          website: data.website || null,
          instagram: data.instagram || null,
          other_social: data.other_social || null,
          capacity: data.capacity || null,
          best_for: data.best_for || null,
          accessibility_notes: data.accessibility_notes || null,
          source: "UserSubmitted" as any,
          status: "Pending" as any,
          owner_user_id: session.user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!insertedData) throw new Error("Failed to create location");

      // Upload logo if provided and update location
      if (logoFile) {
        const logoUrl = await uploadLogo(insertedData.id);
        if (logoUrl) {
          const { error: updateError } = await supabase
            .from('locations')
            .update({ logo_url: logoUrl })
            .eq('id', insertedData.id);
          
          if (updateError) console.error("Failed to update logo:", updateError);
        }
      }

      toast({
        title: "Success!",
        description: "Your location has been submitted and is pending review.",
      });

      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">Please sign in to submit a location</p>
        <Button onClick={() => window.location.href = '/auth'}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Submit a Location</h2>
        <p className="text-sm text-muted-foreground">Your submission will be reviewed before appearing on the map</p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select onValueChange={(value) => setValue("category", value)} defaultValue="Venue">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input id="subcategory" {...register("subcategory")} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={3} />
        </div>

        {/* Logo Upload */}
        <div>
          <Label>Logo</Label>
          <div className="mt-2">
            {logoPreview ? (
              <div className="relative inline-block">
                <img src={logoPreview} alt="Logo preview" className="w-32 h-32 object-cover rounded-lg border" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={removeLogo}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload logo</span>
                <span className="text-xs text-muted-foreground">JPG, PNG or WebP (max 5MB)</span>
                <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Address</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowManualAddress(!showManualAddress)}
            className="text-xs"
          >
            <MapPin className="w-3 h-3 mr-1" />
            {showManualAddress ? "Use address search" : "Enter manually"}
          </Button>
        </div>

        {!showManualAddress ? (
          <>
            <div>
              <Label>Search Address *</Label>
              <AddressAutocomplete
                onAddressSelect={handleAddressSelect}
                placeholder="Start typing an address..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Search for your address to auto-fill all fields
              </p>
            </div>

            {/* Show filled values as preview */}
            {watch("address") && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm space-y-1">
                <p className="font-medium">{watch("address")}</p>
                <p className="text-muted-foreground">
                  {watch("suburb")}, {watch("state")} {watch("postcode")}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suburb">Suburb *</Label>
                <Input id="suburb" {...register("suburb")} />
                {errors.suburb && <p className="text-sm text-destructive mt-1">{errors.suburb.message}</p>}
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select onValueChange={(value) => setValue("state", value)} defaultValue="QLD">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <Input id="postcode" {...register("postcode")} />
                {errors.postcode && <p className="text-sm text-destructive mt-1">{errors.postcode.message}</p>}
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input id="country" {...register("country")} defaultValue="Australia" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact & Social */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact & Social</h3>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" {...register("website")} placeholder="https://" />
          {errors.website && <p className="text-sm text-destructive mt-1">{errors.website.message}</p>}
        </div>

        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" {...register("instagram")} placeholder="@username" />
        </div>

        <div>
          <Label htmlFor="other_social">Other Social Media</Label>
          <Input id="other_social" {...register("other_social")} />
        </div>
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Details</h3>
        
        <div>
          <Label htmlFor="capacity">Capacity (people)</Label>
          <Input 
            id="capacity" 
            type="number" 
            {...register("capacity", { valueAsNumber: true })} 
          />
        </div>

        <div>
          <Label htmlFor="best_for">Best For</Label>
          <Textarea id="best_for" {...register("best_for")} rows={2} placeholder="e.g., Photography, Events, Workshops" />
        </div>

        <div>
          <Label htmlFor="accessibility_notes">Accessibility Notes</Label>
          <Textarea id="accessibility_notes" {...register("accessibility_notes")} rows={2} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Location"
          )}
        </Button>
      </div>
    </form>
  );
}
