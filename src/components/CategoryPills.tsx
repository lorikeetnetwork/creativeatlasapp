import { Badge } from "@/components/ui/badge";
import { Constants } from "@/integrations/supabase/types";

interface CategoryPillsProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

// Main categories to display as pills
const MAIN_CATEGORIES = [
  "Venue",
  "Studio",
  "Festival",
  "Label",
  "Services",
  "Education",
];

const CategoryPills = ({ selectedCategories, onCategoryToggle }: CategoryPillsProps) => {
  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
      {MAIN_CATEGORIES.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 min-h-[32px] ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-[#111111] text-white border border-[#111111] hover:bg-[#333333]"
            }`}
          >
            {category.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
