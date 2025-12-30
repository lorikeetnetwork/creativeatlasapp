import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShowcase } from "@/hooks/useShowcases";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Eye, User, Calendar, MapPin, Play } from "lucide-react";
import { format } from "date-fns";

const ShowcaseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: showcase, isLoading } = useShowcase(slug || "");

  // Increment view count
  useEffect(() => {
    if (showcase?.id) {
      supabase
        .from("showcases")
        .update({ view_count: (showcase.view_count || 0) + 1 })
        .eq("id", showcase.id)
        .then();
    }
  }, [showcase?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-96 w-full rounded-lg mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
        </main>
      </div>
    );
  }

  if (!showcase) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Showcase not found</h1>
          <Button variant="outline" onClick={() => navigate("/showcases")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </main>
      </div>
    );
  }

  const hasGallery = showcase.gallery_images && showcase.gallery_images.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back button */}
        <Button
          variant="ghost"
          className="-ml-2 mb-6 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/showcases")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>

        {/* Cover Image */}
        {showcase.cover_image_url && (
          <div className="relative h-80 md:h-[500px] rounded-xl overflow-hidden mb-8">
            <img
              src={showcase.cover_image_url}
              alt={showcase.project_title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {showcase.is_featured && (
                  <Badge className="bg-amber-500/90 text-white border-none">Featured</Badge>
                )}
                {showcase.category && (
                  <Badge variant="outline">{showcase.category}</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {showcase.project_title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{showcase.submitter?.full_name || showcase.submitter?.email || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(showcase.created_at), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{showcase.view_count ?? 0} views</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-foreground whitespace-pre-wrap">{showcase.description}</p>
            </div>

            {/* Gallery Images */}
            {hasGallery && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {showcase.gallery_images?.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`Gallery image ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Embed */}
            {showcase.video_url && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Video</h2>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  {showcase.video_url.includes("youtube") || showcase.video_url.includes("youtu.be") ? (
                    <iframe
                      src={showcase.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : showcase.video_url.includes("vimeo") ? (
                    <iframe
                      src={showcase.video_url.replace("vimeo.com/", "player.vimeo.com/video/")}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={showcase.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full h-full"
                    >
                      <Play className="h-16 w-16 text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {showcase.tags && showcase.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {showcase.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            {showcase.project_url && (
              <Card>
                <CardContent className="p-4">
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <a href={showcase.project_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Project
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Collaborators */}
            {showcase.collaborators && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">Collaborators</h3>
                  <p className="text-sm text-muted-foreground">{showcase.collaborators}</p>
                </CardContent>
              </Card>
            )}

            {/* Linked Location */}
            {showcase.location && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{showcase.location.name}</p>
                      {(showcase.location.suburb || showcase.location.state) && (
                        <p className="text-xs text-muted-foreground">
                          {[showcase.location.suburb, showcase.location.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShowcaseDetail;
