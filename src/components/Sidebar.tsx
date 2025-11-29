import { MapPin, LogOut, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryPills from "./CategoryPills";
import LocationList from "./LocationList";
import type { Tables } from "@/integrations/supabase/types";
import type { Session } from "@supabase/supabase-js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Comprehensive list of Australian cities and regions
const REGIONS = [
  "All Australia",
  // Major Cities
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Hobart",
  "Darwin",
  "Canberra",
  // NSW Regions
  "Gold Coast",
  "Northern Rivers",
  "Newcastle",
  "Wollongong",
  "Central Coast NSW",
  "Blue Mountains",
  "Hunter Valley",
  "Illawarra",
  // VIC Regions
  "Geelong",
  "Ballarat",
  "Bendigo",
  "Mornington Peninsula",
  "Yarra Valley",
  "Gippsland",
  "Great Ocean Road",
  // QLD Regions
  "Sunshine Coast",
  "Cairns",
  "Townsville",
  "Toowoomba",
  "Noosa",
  "Fraser Coast",
  "Whitsundays",
  // WA Regions
  "Fremantle",
  "Margaret River",
  "Broome",
  "Bunbury",
  "Geraldton",
  // SA Regions
  "Barossa Valley",
  "Adelaide Hills",
  "Fleurieu Peninsula",
  "McLaren Vale",
  // TAS Regions
  "Launceston",
  "Devonport",
  // NT Regions
  "Alice Springs",
  "Katherine",
  // ACT
  "Queanbeyan",
  // Other
  "Regional NSW",
  "Regional VIC",
  "Regional QLD",
  "Regional WA",
  "Regional SA",
  "Regional TAS",
  "Regional NT",
  "Other",
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
  onSignOut,
  onSignIn
}: SidebarProps) => {
  return <div className="h-full flex flex-col bg-background border-r shadow-sm overflow-hidden">
      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 bg-card-foreground">
          {/* SEARCH Section */}
          <div className="overflow-hidden">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#111111]">
              Search
            </h2>
            <div className="space-y-3">
              <div className="overflow-hidden">
                <CategoryPills selectedCategories={selectedCategories} onCategoryToggle={onCategoryToggle} />
              </div>
              <Input placeholder="Search by keyword" value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="text-sm bg-[#111111] text-white placeholder:text-gray-400 border-[#111111]" />
              <Select value={region} onValueChange={onRegionChange}>
                <SelectTrigger className="text-sm bg-[#111111] text-white border-[#111111]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] text-white border-[#111111] max-h-[300px]">
                  {REGIONS.map(r => <SelectItem key={r} value={r} className="text-white hover:bg-[#333333] focus:bg-[#333333] focus:text-white">
                      {r}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CREATIVE ENTITIES Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#111111]">
              Creative Entities
            </h2>
            <LocationList locations={locations} selectedLocation={selectedLocation} onLocationSelect={onLocationSelect} />
          </div>
        </div>
      </ScrollArea>
    </div>;
};
export default Sidebar;