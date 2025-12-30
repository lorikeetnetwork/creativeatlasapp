import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { PlateEditor } from "@/components/blog/PlateEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Upload, X, Loader2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const resourceTypes = [
  { value: "guide", label: "Guide" },
  { value: "template", label: "Template" },
  { value: "tool", label: "Tool" },
  { value: "directory", label: "Directory" },
  { value: "tutorial", label: "Tutorial" },
];

const categories = [
  { value: "Music Industry", label: "Music Industry" },
  { value: "Visual Arts, Design & Craft", label: "Visual Arts & Design" },
  { value: "Events, Festivals & Live Performance", label: "Events & Live Performance" },
  { value: "Media, Content & Communications", label: "Media & Communications" },
  { value: "Education, Training & Professional Development", label: "Education & Training" },
];

const ResourceEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [session, setSession] = useState<Session | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<any[]>([{ type: "p", children: [{ text: "" }] }]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [resourceType, setResourceType] = useState<string>("guide");
  const [category, setCategory] = useState<string>("");
  const [externalUrl, setExternalUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch existing resource if editing
  const { data: existingResource, isLoading: resourceLoading } = useQuery({
    queryKey: ["resource_edit", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Populate form when editing
  useEffect(() => {
    if (existingResource) {
      setTitle(existingResource.title);
      setSlug(existingResource.slug);
      setDescription(existingResource.description || "");
      setContent(existingResource.content as any[] || [{ type: "p", children: [{ text: "" }] }]);
      setCoverImageUrl(existingResource.cover_image_url || "");
      setResourceType(existingResource.resource_type);
      setCategory(existingResource.category || "");
      setExternalUrl(existingResource.external_url || "");
      setFileUrl((existingResource as any).file_url || "");
      setIsFeatured(existingResource.is_featured || false);
      setIsPublished(existingResource.status === "published");
    }
  }, [existingResource]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  // Handle cover image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resource-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("resource-files")
        .getPublicUrl(fileName);

      setCoverImageUrl(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}/files/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resource-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("resource-files")
        .getPublicUrl(fileName);

      setFileUrl(publicUrl);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload file: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Save resource
  const handleSave = async (publish: boolean = false) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save resources");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setIsSaving(true);
    try {
      const resourceData = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        content,
        cover_image_url: coverImageUrl || null,
        resource_type: resourceType as any,
        category: category || null,
        external_url: externalUrl || null,
        file_url: fileUrl || null,
        is_featured: isFeatured,
        status: publish ? "published" : "draft",
        author_id: session.user.id,
      };

      if (isEditing && id) {
        const { error } = await supabase
          .from("resources")
          .update(resourceData as any)
          .eq("id", id);

        if (error) throw error;
        toast.success(publish ? "Resource published!" : "Resource saved as draft");
      } else {
        const { error } = await supabase.from("resources").insert(resourceData as any);

        if (error) throw error;
        toast.success(publish ? "Resource published!" : "Resource saved as draft");
      }

      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["my-resources"] });
      navigate("/resources/my-resources");
    } catch (error: any) {
      toast.error("Failed to save resource: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) {
    return null;
  }

  if (resourceLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="-ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/resources/my-resources")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter resource title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                placeholder="resource-url-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                /resources/{slug || "your-resource-slug"}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the resource..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label>Content</Label>
              <PlateEditor
                value={content}
                onChange={setContent}
                placeholder="Add detailed information about this resource..."
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coverImageUrl ? (
                  <div className="relative">
                    <img
                      src={coverImageUrl}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => setCoverImageUrl("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Upload cover image
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Resource Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resource Type */}
                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <Select value={resourceType} onValueChange={setResourceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* External URL */}
                <div className="space-y-2">
                  <Label htmlFor="externalUrl">External URL</Label>
                  <Input
                    id="externalUrl"
                    placeholder="https://..."
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Resource</Label>
                  <Switch
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Downloadable File</CardTitle>
              </CardHeader>
              <CardContent>
                {fileUrl ? (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm truncate flex-1">File uploaded</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setFileUrl("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">
                          Upload file
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourceEditor;
