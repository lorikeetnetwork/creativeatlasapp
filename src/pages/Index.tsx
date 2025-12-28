import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MapView, { type MapBounds } from "@/components/MapView";
import LocationDetail from "@/components/LocationDetail";
import LocationSubmissionForm from "@/components/LocationSubmissionForm";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import MobileLocationSheet from "@/components/MobileLocationSheet";
import MobileLocationDetail from "@/components/MobileLocationDetail";
import AuthPromptOverlay from "@/components/AuthPromptOverlay";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocations } from "@/hooks/useLocations";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Tables<"locations">[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Tables<"locations"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [region, setRegion] = useState("All Australia");
  const [showDetail, setShowDetail] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Use rate-limited locations hook
  const { locations, loading: isLoading, error: locationsError } = useLocations();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [locations, searchQuery, selectedCategories, mapBounds]);

  useEffect(() => {
    if (locationsError) {
      toast({
        title: "Error",
        description: locationsError,
        variant: "destructive"
      });
    }
  }, [locationsError, toast]);

  const filterLocations = () => {
    let filtered = [...locations];
    
    // Filter by map bounds first (shows only what's visible on map)
    if (mapBounds) {
      filtered = filtered.filter(loc => 
        loc.latitude >= mapBounds.south &&
        loc.latitude <= mapBounds.north &&
        loc.longitude >= mapBounds.west &&
        loc.longitude <= mapBounds.east
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(loc => loc.name.toLowerCase().includes(query) || loc.suburb.toLowerCase().includes(query) || loc.state.toLowerCase().includes(query) || loc.description?.toLowerCase().includes(query));
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(loc => selectedCategories.includes(loc.category));
    }
    setFilteredLocations(filtered);
  };

  // Debounced bounds change handler
  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setMapBounds(bounds);
  }, []);

  const handleLocationSelect = (location: Tables<"locations">) => {
    setSelectedLocation(location);
    if (isMobile) {
      setMobileDetailOpen(true);
    } else {
      setShowDetail(true);
    }
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

  // Mobile Layout
  if (isMobile) {
    return <div className="h-screen flex flex-col bg-background">
        {/* Mobile Topbar */}
        <Topbar session={session} onSignOut={handleSignOut} onSignIn={() => navigate("/auth")} onOpenForm={handleOpenForm} isSidebarCollapsed={true} onToggleSidebar={() => setMobileSheetOpen(true)} />

        {/* Full Screen Map */}
        <div className="flex-1 relative">
          <MapView locations={filteredLocations} selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} onBoundsChange={handleBoundsChange} />

          {/* Auth Prompt Overlay for unauthenticated users */}
          {!session && <AuthPromptOverlay />}

          {/* Floating Action Button for Search */}
          {session && (
            <Button onClick={() => setMobileSheetOpen(true)} className="absolute bottom-6 left-4 h-14 px-5 rounded-full shadow-lg z-10">
              <Search className="w-5 h-5 mr-2" />
              Search
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {filteredLocations.length}
              </span>
            </Button>
          )}
        </div>

        {/* Mobile Search Sheet */}
        {session && <MobileLocationSheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen} searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedCategories={selectedCategories} onCategoryToggle={handleCategoryToggle} region={region} onRegionChange={setRegion} locations={filteredLocations} selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} />}

        {/* Mobile Location Detail */}
        {session && <MobileLocationDetail location={selectedLocation} open={mobileDetailOpen} onOpenChange={setMobileDetailOpen} />}

        {/* Location Submission Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <LocationSubmissionForm session={session} onSuccess={() => {
            setIsFormOpen(false);
          }} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>;
  }

  // Desktop Layout
  return <div className="h-screen flex flex-col bg-background">
      {/* Topbar */}
      <Topbar session={session} onSignOut={handleSignOut} onSignIn={() => navigate("/auth")} onOpenForm={handleOpenForm} isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Fixed Layout without resize */}
      <div className="flex-1 flex">
        {/* Fixed Width Sidebar */}
        {!isSidebarCollapsed && session && (
          <div className="w-[400px] flex-shrink-0 border-r border-black overflow-hidden">
            <Sidebar session={session} searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedCategories={selectedCategories} onCategoryToggle={handleCategoryToggle} region={region} onRegionChange={setRegion} locations={filteredLocations} selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} onSignOut={handleSignOut} onSignIn={() => navigate("/auth")} />
          </div>
        )}

        {/* Map Panel */}
        <div className="flex-1 relative">
          {showDetail && selectedLocation && session && <div className="absolute top-4 right-4 z-10 w-80 max-h-[calc(100%-2rem)]">
              <LocationDetail location={selectedLocation} onClose={() => setShowDetail(false)} />
            </div>}
          <MapView locations={filteredLocations} selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect} onBoundsChange={handleBoundsChange} />
          
          {/* Auth Prompt Overlay for unauthenticated users */}
          {!session && <AuthPromptOverlay />}
        </div>
      </div>

      {/* Location Submission Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <LocationSubmissionForm session={session} onSuccess={() => {
          setIsFormOpen(false);
        }} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>;
};

export default Index;
