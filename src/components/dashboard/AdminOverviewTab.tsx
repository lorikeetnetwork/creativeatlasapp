import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BentoContentCard } from '@/components/ui/bento-page-layout';
import { AdminStats } from '@/components/admin/AdminStats';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ImageIcon } from 'lucide-react';

export function AdminOverviewTab() {
  const { toast } = useToast();
  const [fetchingImages, setFetchingImages] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });

  const handleFetchOgImages = async () => {
    setFetchingImages(true);
    try {
      const { data: locations, error } = await supabase
        .from("locations")
        .select("id, website")
        .not("website", "is", null)
        .is("og_image_url", null);

      if (error) throw error;

      if (!locations || locations.length === 0) {
        toast({
          title: "No locations to process",
          description: "All locations with websites already have OG images.",
        });
        setFetchingImages(false);
        return;
      }

      setFetchProgress({ current: 0, total: locations.length });

      let successCount = 0;
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        setFetchProgress({ current: i + 1, total: locations.length });

        try {
          const response = await supabase.functions.invoke("fetch-og-image", {
            body: { url: loc.website },
          });

          if (response.data?.ogImage) {
            await supabase
              .from("locations")
              .update({ og_image_url: response.data.ogImage })
              .eq("id", loc.id);
            successCount++;
          }
        } catch (err) {
          console.error(`Failed to fetch OG image for ${loc.website}:`, err);
        }
      }

      toast({
        title: "OG Images Fetched",
        description: `Successfully fetched ${successCount} of ${locations.length} images.`,
      });
    } catch (error) {
      console.error("Error fetching OG images:", error);
      toast({
        title: "Error",
        description: "Failed to fetch OG images.",
        variant: "destructive",
      });
    } finally {
      setFetchingImages(false);
      setFetchProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <AdminStats />
      
      <BentoContentCard title="Fetch Social Images" headerActions={<ImageIcon className="w-4 h-4 text-muted-foreground" />}>
        <p className="text-muted-foreground text-sm mb-4">
          Fetch Open Graph images from websites for locations that have a website but no OG image yet.
        </p>
        {fetchingImages && (
          <div className="mb-4">
            <Progress value={(fetchProgress.current / fetchProgress.total) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Processing {fetchProgress.current} of {fetchProgress.total} locations...
            </p>
          </div>
        )}
        <Button
          onClick={handleFetchOgImages}
          disabled={fetchingImages}
          variant="outline"
        >
          {fetchingImages ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              Fetch OG Images
            </>
          )}
        </Button>
      </BentoContentCard>
    </div>
  );
}
