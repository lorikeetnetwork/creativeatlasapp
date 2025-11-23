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
    <div className="flex flex-wrap gap-2">
      {MAIN_CATEGORIES.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
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
