import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/AdminStats";
import { PendingLocationsTable } from "@/components/admin/PendingLocationsTable";
import { BulkImport } from "@/components/admin/BulkImport";
import { Loader2, ArrowLeft, ImageIcon, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoContentCard,
} from "@/components/ui/bento-page-layout";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingImages, setFetchingImages] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Access Denied",
          description: "You must be logged in to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (error) throw error;

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast({
        title: "Error",
        description: "Failed to verify admin access.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <BentoPage>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BentoPage>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <BentoPage>
      <BentoMain className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/map")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
        </div>

        <BentoPageHeader
          icon={<Shield className="h-8 w-8" />}
          title="Admin Dashboard"
          description="Manage locations and review submissions"
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-auto min-w-full bg-[#1a1a1a] border border-[#333] p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm">Overview</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm">Pending</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm">All Locations</TabsTrigger>
              <TabsTrigger value="bulk-import" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm">Bulk Import</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
            
            <BentoContentCard title="Fetch Social Images" headerActions={<ImageIcon className="w-4 h-4 text-gray-400" />}>
              <p className="text-gray-400 text-sm mb-4">
                Fetch Open Graph images from websites for locations that have a website but no OG image yet.
              </p>
              {fetchingImages && (
                <div className="mb-4">
                  <Progress value={(fetchProgress.current / fetchProgress.total) * 100} className="h-2 bg-[#333]" />
                  <p className="text-xs text-gray-400 mt-1">
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
          </TabsContent>

          <TabsContent value="pending">
            <BentoContentCard>
              <PendingLocationsTable status="Pending" />
            </BentoContentCard>
          </TabsContent>

          <TabsContent value="all">
            <BentoContentCard>
              <PendingLocationsTable status="all" />
            </BentoContentCard>
          </TabsContent>

          <TabsContent value="bulk-import">
            <BentoContentCard>
              <BulkImport />
            </BentoContentCard>
          </TabsContent>
        </Tabs>
      </BentoMain>
    </BentoPage>
  );
}
