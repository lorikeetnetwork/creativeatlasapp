import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { ShowcaseFilters as ShowcaseFiltersType } from "@/hooks/useShowcases";

interface ShowcaseFiltersProps {
  filters: ShowcaseFiltersType;
  onFiltersChange: (filters: ShowcaseFiltersType) => void;
}

const categories = [
  { value: "Music Industry", label: "Music Industry" },
  { value: "Visual Arts, Design & Craft", label: "Visual Arts & Design" },
  { value: "Events, Festivals & Live Performance", label: "Events & Live Performance" },
  { value: "Media, Content & Communications", label: "Media & Communications" },
  { value: "Film & TV Production Companies", label: "Film & TV" },
  { value: "Photography Studios", label: "Photography" },
  { value: "Design Studios", label: "Design" },
  { value: "Animation & Motion Studios", label: "Animation & Motion" },
  { value: "Game Development Studios", label: "Game Development" },
];

export function ShowcaseFilters({ filters, onFiltersChange }: ShowcaseFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search showcases..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

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
