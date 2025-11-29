import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryPills from "./CategoryPills";
import LocationList from "./LocationList";
import type { Tables } from "@/integrations/supabase/types";

const REGIONS = ["All Australia", "Gold Coast", "Northern Rivers", "Brisbane", "Sydney", "Melbourne"];

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
