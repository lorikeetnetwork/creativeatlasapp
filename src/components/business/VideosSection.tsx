import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/integrations/supabase/types";

interface VideosSectionProps {
  locationId: string;
}

type BusinessVideo = Tables<"business_videos">;

const VideosSection = ({ locationId }: VideosSectionProps) => {
  const [videos, setVideos] = useState<BusinessVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [locationId]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("business_videos")
        .select("*")
        .eq("location_id", locationId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmbedUrl = (url: string, platform: string | null) => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be") || platform === "youtube") {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]?.split("?")[0]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.includes("vimeo.com") || platform === "vimeo") {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Return original URL if already an embed URL
    return url;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-muted"></div>
            <CardContent className="pt-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No videos available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <div className="aspect-video bg-black">
            <iframe
              src={getEmbedUrl(video.video_url, video.video_platform)}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{video.title}</CardTitle>
            {video.description && (
              <CardDescription>{video.description}</CardDescription>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default VideosSection;
