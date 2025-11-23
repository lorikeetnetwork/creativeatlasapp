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
    <div className="h-full flex flex-col bg-card border-r shadow-sm">
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

          {/* CREATIVE ENTITIES Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-foreground">
              Creative Entities
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
