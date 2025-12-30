import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { ResourceFilters as ResourceFiltersType } from "@/hooks/useResources";

interface ResourceFiltersProps {
  filters: ResourceFiltersType;
  onFiltersChange: (filters: ResourceFiltersType) => void;
}

const resourceTypes = [
  { value: "guide", label: "Guides" },
  { value: "template", label: "Templates" },
  { value: "tool", label: "Tools" },
  { value: "directory", label: "Directories" },
  { value: "tutorial", label: "Tutorials" },
];

const categories = [
  { value: "Music Industry", label: "Music Industry" },
  { value: "Visual Arts, Design & Craft", label: "Visual Arts & Design" },
  { value: "Events, Festivals & Live Performance", label: "Events & Live Performance" },
  { value: "Media, Content & Communications", label: "Media & Communications" },
  { value: "Education, Training & Professional Development", label: "Education & Training" },
];

export function ResourceFilters({ filters, onFiltersChange }: ResourceFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>
      
      <Select
        value={filters.resourceType || "all"}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, resourceType: value === "all" ? null : value as any })
        }
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Resource Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {resourceTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.category || "all"}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, category: value === "all" ? null : value as any })
        }
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
