import { CATEGORY_GROUPS } from "@/utils/categoryGroups";

interface CategoryPillsProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

// Use category group names as pills for high-level filtering
const PILL_GROUPS = [
  "Music & Recording",
  "Live Events & Festivals", 
  "Visual Arts & Media",
  "Technology & Digital",
  "Cultural & Community Spaces",
  "Performing Arts",
  "Gaming & Immersive",
  "Education & Development",
];

const CategoryPills = ({ selectedCategories, onCategoryToggle }: CategoryPillsProps) => {
  // Check if any category from a group is selected
  const isGroupSelected = (groupName: string) => {
    const group = CATEGORY_GROUPS.find((g) => g.name === groupName);
    if (!group) return false;
    return group.categories.some((cat) => selectedCategories.includes(cat));
  };

  // Toggle all categories in a group
  const handleGroupToggle = (groupName: string) => {
    const group = CATEGORY_GROUPS.find((g) => g.name === groupName);
    if (!group) return;
    
    const isCurrentlySelected = isGroupSelected(groupName);
    
    // If group is selected, deselect all its categories
    // If not selected, select all its categories
    group.categories.forEach((cat) => {
      const isCatSelected = selectedCategories.includes(cat);
      if (isCurrentlySelected && isCatSelected) {
        onCategoryToggle(cat);
      } else if (!isCurrentlySelected && !isCatSelected) {
        onCategoryToggle(cat);
      }
    });
  };

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
      {PILL_GROUPS.map((groupName) => {
        const isSelected = isGroupSelected(groupName);
        return (
          <button
            key={groupName}
            onClick={() => handleGroupToggle(groupName)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 min-h-[32px] ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-[#111111] text-white border border-[#111111] hover:bg-[#333333]"
            }`}
          >
            {groupName.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
