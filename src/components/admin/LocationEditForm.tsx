import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, RefreshCw, Trash2 } from "lucide-react";
import AddressAutocomplete, { type ParsedAddress } from "@/components/AddressAutocomplete";

const CATEGORIES = [
  "Venue",
  "Studio",
  "Festival",
  "Label",
  "Management",
  "Services",
  "Education",
  "Government/Peak Body",
  "Community Organisation",
  "Co-working/Creative Hub",
  "Gallery/Arts Space",
  "Other",
] as const;

const STATES = ["QLD", "NSW", "VIC", "SA", "WA", "TAS", "NT", "ACT"] as const;
const STATUSES = ["Pending", "Active", "Rejected", "Inactive", "PendingPayment"] as const;

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  status: z.string().min(1),
  address: z.string().min(1, "Address is required").max(200),
  suburb: z.string().min(1, "Suburb is required").max(100),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required").max(10),
  country: z.string().min(1).max(100),
  latitude: z.number(),
  longitude: z.number(),
  email: z.string().email("Invalid email").max(255).optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  website: z.string().url("Invalid URL").max(255).optional().nullable().or(z.literal("")),
  instagram: z.string().max(100).optional().nullable(),
  other_social: z.string().max(255).optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  best_for: z.string().max(500).optional().nullable(),
  accessibility_notes: z.string().max(500).optional().nullable(),
  og_image_url: z.string().url().optional().nullable().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface LocationEditFormProps {
  location: any;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function LocationEditForm({ location, open, onClose, onUpdate }: LocationEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingOg, setIsFetchingOg] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location.name,
      category: location.category,
      subcategory: location.subcategory || "",
      description: location.description || "",
      status: location.status,
      address: location.address,
      suburb: location.suburb,
      state: location.state,
      postcode: location.postcode,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      email: location.email || "",
      phone: location.phone || "",
      website: location.website || "",
      instagram: location.instagram || "",
      other_social: location.other_social || "",
      capacity: location.capacity || undefined,
      best_for: location.best_for || "",
      accessibility_notes: location.accessibility_notes || "",
      og_image_url: location.og_image_url || "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchPhotos();
      setLogoPreview(location.logo_url || null);
    }
  }, [open, location.id]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("location_photos")
        .select("*")
        .eq("location_id", location.id)
        .order("display_order");
      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleAddressSelect = (parsedAddress: ParsedAddress) => {
    setValue("address", parsedAddress.address);
    setValue("suburb", parsedAddress.suburb);
    setValue("state", parsedAddress.state);
    setValue("postcode", parsedAddress.postcode);
    setValue("country", parsedAddress.country);
    setValue("latitude", parsedAddress.latitude);
    setValue("longitude", parsedAddress.longitude);
  };

  const fetchOgImage = async () => {
    const website = watch("website");
    if (!website) {
      toast({ title: "No website URL", description: "Please enter a website URL first", variant: "destructive" });
      return;
    }

    setIsFetchingOg(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-og-image", {
        body: { url: website },
      });
      if (error) throw error;
      if (data?.ogImage) {
        setValue("og_image_url", data.ogImage);
        toast({ title: "Success", description: "OG image fetched successfully" });
      } else {
        toast({ title: "No image found", description: "Could not find an OG image on that website", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching OG image:", error);
      toast({ title: "Error", description: "Failed to fetch OG image", variant: "destructive" });
    } finally {
      setIsFetchingOg(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a JPG, PNG, or WebP image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Logo must be less than 5MB", variant: "destructive" });
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const deletePhoto = async (photoId: string, photoUrl: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      const { error } = await supabase.from("location_photos").delete().eq("id", photoId);
      if (error) throw error;
      setPhotos(photos.filter((p) => p.id !== photoId));
      toast({ title: "Photo deleted" });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({ title: "Error", description: "Failed to delete photo", variant: "destructive" });
    }
  };

  const handleNewPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    });
    setNewPhotoFiles([...newPhotoFiles, ...validFiles]);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Upload new logo if provided
      let logoUrl = location.logo_url;
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const filePath = `admin/${location.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("location-logos").upload(filePath, logoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("location-logos").getPublicUrl(filePath);
        logoUrl = urlData.publicUrl;
      } else if (logoPreview === null) {
        logoUrl = null;
      }

      // Update location
      const { error: updateError } = await supabase
        .from("locations")
        .update({
          name: data.name,
          category: data.category as any,
          subcategory: data.subcategory || null,
          description: data.description || null,
          status: data.status as any,
          address: data.address,
          suburb: data.suburb,
          state: data.state,
          postcode: data.postcode,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
          email: data.email || null,
          phone: data.phone || null,
          website: data.website || null,
          instagram: data.instagram || null,
          other_social: data.other_social || null,
          capacity: data.capacity || null,
          best_for: data.best_for || null,
          accessibility_notes: data.accessibility_notes || null,
          og_image_url: data.og_image_url || null,
          logo_url: logoUrl,
        })
        .eq("id", location.id);

      if (updateError) throw updateError;

      // Upload new photos
      for (let i = 0; i < newPhotoFiles.length; i++) {
        const file = newPhotoFiles[i];
        const fileExt = file.name.split(".").pop();
        const filePath = `admin/${location.id}/${Date.now()}_${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("location-photos").upload(filePath, file);
        if (uploadError) continue;
        const { data: urlData } = supabase.storage.from("location-photos").getPublicUrl(filePath);
        await supabase.from("location_photos").insert({
          location_id: location.id,
          photo_url: urlData.publicUrl,
          display_order: photos.length + i,
        });
      }

      toast({ title: "Success", description: "Location updated successfully" });
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating location:", error);
      toast({ title: "Error", description: "Failed to update location", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Location: {location.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Accordion type="multiple" defaultValue={["basic", "address", "contact", "media", "additional"]} className="w-full">
            {/* Basic Information */}
            <AccordionItem value="basic">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select onValueChange={(value) => setValue("status", value)} defaultValue={location.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue("category", value)} defaultValue={location.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input id="subcategory" {...register("subcategory")} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} rows={3} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Address */}
            <AccordionItem value="address">
              <AccordionTrigger>Address</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label>Search Address</Label>
                  <AddressAutocomplete onAddressSelect={handleAddressSelect} placeholder="Search to update address..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" {...register("address")} />
                  </div>
                  <div>
                    <Label htmlFor="suburb">Suburb *</Label>
                    <Input id="suburb" {...register("suburb")} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={(value) => setValue("state", value)} defaultValue={location.state}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input id="postcode" {...register("postcode")} />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...register("country")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="any" {...register("latitude", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="any" {...register("longitude", { valueAsNumber: true })} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Contact & Social */}
            <AccordionItem value="contact">
              <AccordionTrigger>Contact & Social</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" {...register("website")} placeholder="https://" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" {...register("instagram")} placeholder="@handle" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="other_social">Other Social Links</Label>
                  <Input id="other_social" {...register("other_social")} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Media */}
            <AccordionItem value="media">
              <AccordionTrigger>Media</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* Logo */}
                <div>
                  <Label>Logo</Label>
                  <div className="mt-2 flex items-start gap-4">
                    {logoPreview ? (
                      <div className="relative">
                        <img src={logoPreview} alt="Logo" className="w-24 h-24 object-cover rounded-lg border" />
                        <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={removeLogo}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                      </label>
                    )}
                  </div>
                </div>

                {/* OG Image */}
                <div>
                  <Label htmlFor="og_image_url">OG Image URL</Label>
                  <div className="flex gap-2">
                    <Input id="og_image_url" {...register("og_image_url")} placeholder="https://..." />
                    <Button type="button" variant="outline" onClick={fetchOgImage} disabled={isFetchingOg}>
                      {isFetchingOg ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </Button>
                  </div>
                  {watch("og_image_url") && (
                    <img src={watch("og_image_url") || ""} alt="OG Preview" className="mt-2 w-full h-32 object-cover rounded-lg border" />
                  )}
                </div>

                {/* Existing Photos */}
                <div>
                  <Label>Photos ({photos.length})</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img src={photo.photo_url} alt={photo.caption || "Photo"} className="w-full h-20 object-cover rounded" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deletePhoto(photo.id, photo.photo_url)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Photos */}
                <div>
                  <Label>Add Photos</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Click to add photos</span>
                      <input type="file" className="hidden" accept="image/*" multiple onChange={handleNewPhotos} />
                    </label>
                  </div>
                  {newPhotoFiles.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {newPhotoFiles.map((file, i) => (
                        <div key={i} className="relative">
                          <img src={URL.createObjectURL(file)} alt="New" className="w-16 h-16 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-1 -right-1 h-5 w-5"
                            onClick={() => setNewPhotoFiles(newPhotoFiles.filter((_, idx) => idx !== i))}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Additional Details */}
            <AccordionItem value="additional">
              <AccordionTrigger>Additional Details</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" {...register("capacity", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="best_for">Best For</Label>
                    <Input id="best_for" {...register("best_for")} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accessibility_notes">Accessibility Notes</Label>
                  <Textarea id="accessibility_notes" {...register("accessibility_notes")} rows={2} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
