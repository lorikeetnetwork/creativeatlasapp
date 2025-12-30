import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X, Loader2, Plus } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type LocationCategory = Database["public"]["Enums"]["location_category"];

const categories = [
  { value: "Music Industry", label: "Music Industry" },
  { value: "Visual Arts, Design & Craft", label: "Visual Arts & Design" },
  { value: "Film & TV Production Companies", label: "Film & TV" },
  { value: "Photography Studios", label: "Photography" },
  { value: "Design Studios", label: "Design" },
  { value: "Animation & Motion Studios", label: "Animation & Motion" },
];

const ShowcaseEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [session, setSession] = useState<Session | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  const { data: existingShowcase, isLoading } = useQuery({
    queryKey: ["showcase_edit", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("showcases").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (existingShowcase) {
      setProjectTitle(existingShowcase.project_title);
      setSlug(existingShowcase.slug);
      setDescription(existingShowcase.description);
      setCoverImageUrl(existingShowcase.cover_image_url || "");
      setGalleryImages(existingShowcase.gallery_images || []);
      setVideoUrl(existingShowcase.video_url || "");
      setProjectUrl(existingShowcase.project_url || "");
      setCategory(existingShowcase.category || "");
      setTags(existingShowcase.tags?.join(", ") || "");
      setCollaborators(existingShowcase.collaborators || "");
    }
  }, [existingShowcase]);

  useEffect(() => {
    if (!isEditing && projectTitle) {
      setSlug(projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [projectTitle, isEditing]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;
    setIsUploading(true);
    try {
      const fileName = `${session.user.id}/${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("showcase-images").upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("showcase-images").getPublicUrl(fileName);
      if (isGallery) {
        setGalleryImages([...galleryImages, publicUrl]);
      } else {
        setCoverImageUrl(publicUrl);
      }
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id || !projectTitle.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setIsSaving(true);
    try {
      const data = {
        project_title: projectTitle.trim(),
        slug: slug.trim(),
        description: description.trim(),
        cover_image_url: coverImageUrl || null,
        gallery_images: galleryImages.length ? galleryImages : null,
        video_url: videoUrl || null,
        project_url: projectUrl || null,
        category: (category || null) as LocationCategory | null,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : null,
        collaborators: collaborators || null,
        submitted_by: session.user.id,
        is_approved: false,
      };
      if (isEditing && id) {
        await supabase.from("showcases").update(data).eq("id", id);
      } else {
        await supabase.from("showcases").insert(data);
      }
      toast.success("Showcase submitted for review!");
      queryClient.invalidateQueries({ queryKey: ["my-showcases"] });
      navigate("/showcases/my-showcases");
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!session || isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/showcases/my-showcases")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground">{isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Submit for Review</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2"><Label>Project Title</Label><Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Your project name" /></div>
            <div className="space-y-2"><Label>URL Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /><p className="text-xs text-muted-foreground">/showcases/{slug || "your-slug"}</p></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Tell us about your project..." /></div>
            <div className="space-y-2"><Label>Tags (comma separated)</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="design, music, collaboration" /></div>
            <div className="space-y-2"><Label>Collaborators</Label><Input value={collaborators} onChange={(e) => setCollaborators(e.target.value)} placeholder="List collaborators..." /></div>
          </div>
          <div className="space-y-6">
            <Card><CardHeader><CardTitle className="text-base">Cover Image</CardTitle></CardHeader><CardContent>{coverImageUrl ? <div className="relative"><img src={coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded-lg" /><Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setCoverImageUrl("")}><X className="h-3 w-3" /></Button></div> : <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">{isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <><Upload className="h-8 w-8 text-muted-foreground mb-2" /><span className="text-sm text-muted-foreground">Upload</span></>}<input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} /></label>}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Settings</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Project URL</Label><Input value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://..." /></div><div className="space-y-2"><Label>Video URL</Label><Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube or Vimeo link" /></div></CardContent></Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShowcaseEditor;
