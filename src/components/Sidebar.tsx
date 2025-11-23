import { MapPin, Plus, LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryPills from "./CategoryPills";
import LocationList from "./LocationList";
import type { Tables } from "@/integrations/supabase/types";
import type { Session } from "@supabase/supabase-js";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const REGIONS = [
  "All Australia",
  "Gold Coast",
  "Northern Rivers",
  "Brisbane",
  "Sydney",
  "Melbourne",
];

interface SidebarProps {
  session: Session | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  region: string;
  onRegionChange: (region: string) => void;
  locations: Tables<"locations">[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
  onOpenForm: () => void;
  onSignOut: () => void;
  onSignIn: () => void;
}

const Sidebar = ({
  session,
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  region,
  onRegionChange,
  locations,
  selectedLocation,
  onLocationSelect,
  onOpenForm,
  onSignOut,
  onSignIn,
}: SidebarProps) => {
  return (
    <div className="w-80 h-screen flex flex-col bg-card border-r shadow-sm">
      {/* Top Branding + User Menu */}
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-sunset flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">CREATIVE MAP</h1>
              <p className="text-[10px] text-muted-foreground">AUSTRALIA</p>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session ? (
                <>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    My Listings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={onSignIn}>
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground">
          {locations.length} location{locations.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* SEARCH Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground">
              Search
            </h2>
            <div className="space-y-3">
              <CategoryPills
                selectedCategories={selectedCategories}
                onCategoryToggle={onCategoryToggle}
              />
              <Input
                placeholder="Search by keyword"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="text-sm"
              />
              <Select value={region} onValueChange={onRegionChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SUBMIT Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground">
              Submit
            </h2>
            <Button
              onClick={onOpenForm}
              className="w-full justify-between shadow-warm"
            >
              OPEN FORM
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* DATABASE Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground">
              Database
            </h2>
            <LocationList
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
