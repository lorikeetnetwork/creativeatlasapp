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
import { Constants } from "@/integrations/supabase/types";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  region: string;
  onRegionChange: (value: string) => void;
}

const REGIONS = [
  "All Australia",
  "Gold Coast",
  "Northern Rivers",
  "Brisbane",
  "Sydney",
  "Melbourne",
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
  const categories = Constants.public.Enums.location_category;

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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Categories</SheetTitle>
            <SheetDescription>
              Select the types of locations you want to see
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {categories.map((category) => (
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchFilters;
