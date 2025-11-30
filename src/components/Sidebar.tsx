import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, CATEGORY_SHORT_NAMES } from "@/utils/categoryGroups";
import LocationList from "./LocationList";
import type { Tables } from "@/integrations/supabase/types";
import type { Session } from "@supabase/supabase-js";

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
  return (
    <div className="h-full flex flex-col bg-card-foreground border-r shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-card-foreground">
        <div className="p-4 space-y-4">
          {/* SEARCH Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#111111]">
              Search
            </h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5 pb-2">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  const shortName = CATEGORY_SHORT_NAMES[category] || category;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => onCategoryToggle(category)}
                      title={category}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-[#222] text-white border border-[#333] hover:bg-[#333]"
                      }`}
                    >
                      {shortName.toUpperCase()}
                    </button>
                  );
                })}
              </div>
              <Input 
                placeholder="Search by keyword" 
                value={searchQuery} 
                onChange={e => onSearchChange(e.target.value)} 
                className="text-sm bg-[#111111] text-white placeholder:text-gray-400 border-[#111111]" 
              />
              <Select value={region} onValueChange={onRegionChange}>
                <SelectTrigger className="text-sm bg-[#111111] text-white border-[#111111]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] text-white border-[#111111] max-h-[300px]">
                  {REGIONS.map(r => (
                    <SelectItem 
                      key={r} 
                      value={r} 
                      className="text-white hover:bg-[#333333] focus:bg-[#333333] focus:text-white"
                    >
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CREATIVE ENTITIES Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#111111]">
              Creative Entities
            </h2>
            <LocationList 
              locations={locations} 
              selectedLocation={selectedLocation} 
              onLocationSelect={onLocationSelect} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
