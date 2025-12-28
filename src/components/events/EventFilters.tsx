import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import type { EventFilters } from "@/hooks/useEvents";
import { Constants } from "@/integrations/supabase/types";

const eventTypes = Constants.public.Enums.event_type;
const categories = Constants.public.Enums.location_category;

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

const EventFiltersComponent = ({ filters, onFiltersChange }: EventFiltersProps) => {
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
    filters.eventType,
    filters.category,
    filters.startDate,
    filters.endDate,
    filters.isOnline,
    filters.isFree,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-center">
        {/* Event Type */}
        <Select
          value={filters.eventType || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              eventType: value === "all" ? null : (value as any),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eventTypes.map((type) => (
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
          <SelectTrigger className="w-full sm:w-[180px]">
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

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto sm:min-w-[130px] justify-start">
              {filters.startDate
                ? format(filters.startDate, "MMM d")
                : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={filters.startDate || undefined}
              onSelect={(date) =>
                onFiltersChange({ ...filters, startDate: date || null })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto sm:min-w-[130px] justify-start">
              {filters.endDate ? format(filters.endDate, "MMM d") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={filters.endDate || undefined}
              onSelect={(date) =>
                onFiltersChange({ ...filters, endDate: date || null })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Quick Filters */}
        <div className="col-span-2 sm:col-span-1 flex items-center gap-4 sm:ml-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="free-only"
              checked={filters.isFree === true}
              onCheckedChange={(checked) =>
                onFiltersChange({
                  ...filters,
                  isFree: checked ? true : null,
                })
              }
            />
            <Label htmlFor="free-only" className="text-sm cursor-pointer">
              Free
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="online-only"
              checked={filters.isOnline === true}
              onCheckedChange={(checked) =>
                onFiltersChange({
                  ...filters,
                  isOnline: checked ? true : null,
                })
              }
            />
            <Label htmlFor="online-only" className="text-sm cursor-pointer">
              Online
            </Label>
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="col-span-2 sm:col-span-1 text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventFiltersComponent;
