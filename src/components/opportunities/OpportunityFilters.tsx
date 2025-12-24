import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { OpportunityFilters } from "@/hooks/useOpportunities";
import { Constants } from "@/integrations/supabase/types";

const opportunityTypes = Constants.public.Enums.opportunity_type;
const compensationTypes = Constants.public.Enums.compensation_type;
const experienceLevels = Constants.public.Enums.experience_level;
const categories = Constants.public.Enums.location_category;

interface OpportunityFiltersProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
}

const OpportunityFiltersComponent = ({
  filters,
  onFiltersChange,
}: OpportunityFiltersProps) => {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchValue });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({});
  };

  const activeFilterCount = [
    filters.opportunityType,
    filters.category,
    filters.compensationType,
    filters.experienceLevel,
    filters.isRemote,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Opportunity Type */}
        <Select
          value={filters.opportunityType || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              opportunityType: value === "all" ? null : (value as any),
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {opportunityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category */}
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === "all" ? null : (value as any),
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Compensation */}
        <Select
          value={filters.compensationType || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              compensationType: value === "all" ? null : (value as any),
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Pay" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pay Types</SelectItem>
            {compensationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Experience Level */}
        <Select
          value={filters.experienceLevel || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              experienceLevel: value === "all" ? null : (value as any),
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {experienceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Remote Only */}
        <div className="flex items-center gap-2 ml-2">
          <Checkbox
            id="remote-only"
            checked={filters.isRemote === true}
            onCheckedChange={(checked) =>
              onFiltersChange({
                ...filters,
                isRemote: checked ? true : null,
              })
            }
          />
          <Label htmlFor="remote-only" className="text-sm cursor-pointer">
            Remote only
          </Label>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default OpportunityFiltersComponent;
