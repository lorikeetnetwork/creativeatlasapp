import { CATEGORIES, CATEGORY_SHORT_NAMES } from "@/utils/categoryGroups";

interface CategoryPillsProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const CategoryPills = ({ selectedCategories, onCategoryToggle }: CategoryPillsProps) => {
  return (
    <div className="w-full overflow-hidden">
      <div 
        className="flex flex-wrap gap-1.5 pb-2"
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const shortName = CATEGORY_SHORT_NAMES[category] || category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              title={category}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-[#222] text-white border border-[#333] hover:bg-[#333]"
              }`}
            >
              {shortName.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPills;
