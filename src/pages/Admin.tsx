import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/AdminStats";
import { PendingLocationsTable } from "@/components/admin/PendingLocationsTable";
import { BulkImport } from "@/components/admin/BulkImport";
import { Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

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

      // Check if user has admin role
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
      // Get locations with website but no og_image_url
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
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto py-4 md:py-8 px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/map")}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Button>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-400">Manage locations and review submissions</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          {/* Scrollable Tabs for Mobile */}
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-auto min-w-full bg-[#1a1a1a] border border-[#333] p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-3 md:px-4 text-sm">Overview</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-3 md:px-4 text-sm">Pending</TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-3 md:px-4 text-sm">All Locations</TabsTrigger>
              <TabsTrigger value="bulk-import" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-3 md:px-4 text-sm">Bulk Import</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
            
            {/* Fetch OG Images Section */}
            <div className="p-4 bg-[#1a1a1a] border border-[#333] rounded-lg">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Fetch Social Images
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Fetch Open Graph images from websites for locations that have a website but no OG image yet.
              </p>
              {fetchingImages && (
                <div className="mb-4">
                  <Progress value={(fetchProgress.current / fetchProgress.total) * 100} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    Processing {fetchProgress.current} of {fetchProgress.total} locations...
                  </p>
                </div>
              )}
              <Button
                onClick={handleFetchOgImages}
                disabled={fetchingImages}
                variant="outline"
                className="bg-transparent border-[#333] text-white hover:bg-[#333]"
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
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <PendingLocationsTable status="Pending" />
          </TabsContent>

          <TabsContent value="all">
            <PendingLocationsTable status="all" />
          </TabsContent>

          <TabsContent value="bulk-import">
            <BulkImport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
