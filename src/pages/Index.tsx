import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MapView from "@/components/MapView";
import LocationDetail from "@/components/LocationDetail";
import LocationSubmissionForm from "@/components/LocationSubmissionForm";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [locations, setLocations] = useState<Tables<"locations">[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Tables<"locations">[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Tables<"locations"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [region, setRegion] = useState("All Australia");
  const [showDetail, setShowDetail] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    console.log("Index component mounted");
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setSession(session);
      console.log("Session loaded:", session ? "authenticated" : "not authenticated");
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    fetchLocations();
  }, []);
  useEffect(() => {
    filterLocations();
  }, [locations, searchQuery, selectedCategories, region]);
  const fetchLocations = async () => {
    try {
      console.log("Fetching locations...");
      const {
        data,
        error
      } = await supabase.from("locations").select("*").eq("status", "Active").order("name");
      if (error) {
        console.error("Error fetching locations:", error);
        toast({
          title: "Error",
          description: "Failed to load locations",
          variant: "destructive"
        });
      } else {
        console.log("Locations loaded:", data?.length || 0);
        setLocations(data || []);
      }
    } catch (err) {
      console.error("Exception fetching locations:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const filterLocations = () => {
    let filtered = [...locations];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(loc => loc.name.toLowerCase().includes(query) || loc.suburb.toLowerCase().includes(query) || loc.state.toLowerCase().includes(query) || loc.description?.toLowerCase().includes(query));
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(loc => selectedCategories.includes(loc.category));
    }
    if (region !== "All Australia") {
      filtered = filtered.filter(loc => {
        if (region === "Gold Coast") return loc.suburb.toLowerCase().includes("gold coast");
        if (region === "Northern Rivers") return loc.state === "NSW" && loc.suburb.toLowerCase().includes("byron");
        if (region === "Brisbane") return loc.suburb.toLowerCase().includes("brisbane");
        if (region === "Sydney") return loc.suburb.toLowerCase().includes("sydney");
        if (region === "Melbourne") return loc.suburb.toLowerCase().includes("melbourne");
        return true;
      });
    }
    setFilteredLocations(filtered);
  };
  const handleLocationSelect = (location: Tables<"locations">) => {
    setSelectedLocation(location);
    setShowDetail(true);
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
  };
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };
  return <div className="h-screen flex flex-col bg-background">
      {/* Topbar */}
      <Topbar session={session} onSignOut={handleSignOut} onSignIn={() => navigate("/auth")} isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Resizable Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Sidebar Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={40} collapsible={true} collapsedSize={0} onCollapse={() => setIsSidebarCollapsed(true)} onExpand={() => setIsSidebarCollapsed(false)}>
          {!isSidebarCollapsed && <Sidebar session={session} searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedCategories={selectedCategories} onCategoryToggle={handleCategoryToggle} region={region} onRegionChange={setRegion} locations={filteredLocations} selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} onOpenForm={handleOpenForm} onSignOut={handleSignOut} onSignIn={() => navigate("/auth")} />}
        </ResizablePanel>

        {/* Resize Handle */}
        {!isSidebarCollapsed && <ResizableHandle withHandle />}

        {/* Map Panel */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full relative">
            {showDetail && selectedLocation ? <div className="absolute inset-0 z-10 bg-background/95 backdrop-blur-sm p-4">
                <LocationDetail location={selectedLocation} onClose={() => setShowDetail(false)} />
              </div> : null}
            <MapView locations={filteredLocations} selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Location Submission Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <LocationSubmissionForm session={session} onSuccess={() => {
          setIsFormOpen(false);
          fetchLocations();
        }} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>;
};
export default Index;