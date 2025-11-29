import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryPills from "./CategoryPills";
import LocationList from "./LocationList";
import type { Tables } from "@/integrations/supabase/types";

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

interface MobileLocationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  region: string;
  onRegionChange: (region: string) => void;
  locations: Tables<"locations">[];
  selectedLocation: Tables<"locations"> | null;
  onLocationSelect: (location: Tables<"locations">) => void;
}

const MobileLocationSheet = ({
  open,
  onOpenChange,
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  region,
  onRegionChange,
  locations,
  selectedLocation,
  onLocationSelect,
}: MobileLocationSheetProps) => {
  const handleLocationSelect = (location: Tables<"locations">) => {
    onLocationSelect(location);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl bg-secondary-foreground">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left text-foreground">Search & Browse</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 overflow-y-auto h-[calc(100%-4rem)] pb-safe scrollbar-hide">
          {/* Search Section */}
          <div className="space-y-3">
            <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
              <CategoryPills selectedCategories={selectedCategories} onCategoryToggle={onCategoryToggle} />
            </div>
            <Input
              placeholder="Search by keyword"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="text-sm bg-[#111111] text-white placeholder:text-gray-400 border-[#111111]"
            />
            <Select value={region} onValueChange={onRegionChange}>
              <SelectTrigger className="text-sm bg-[#111111] text-white border-[#111111]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] text-white border-[#111111]">
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r} className="text-white hover:bg-[#333333] focus:bg-[#333333] focus:text-white">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location List */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#111111]">
              Creative Entities ({locations.length})
            </h2>
            <LocationList
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileLocationSheet;
