import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORY_GROUPS } from "@/utils/categoryGroups";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  region: string;
  onRegionChange: (value: string) => void;
}

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

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  region,
  onRegionChange,
}: SearchFiltersProps) => {
  return (
    <div className="flex gap-3 items-center bg-card p-4 rounded-lg shadow-md border">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={region} onValueChange={onRegionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Filter Categories</SheetTitle>
            <SheetDescription>
              Select the types of locations you want to see
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            <div className="space-y-6 pr-4">
              {CATEGORY_GROUPS.map((group) => (
                <div key={group.name} className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">{group.name}</h4>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {group.categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => onCategoryToggle(category)}
                        />
                        <Label
                          htmlFor={category}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchFilters;
