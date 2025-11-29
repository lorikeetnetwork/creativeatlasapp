import { CATEGORY_GROUPS } from "@/utils/categoryGroups";
interface CategoryPillsProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

// Shorter names that fit better
const PILL_GROUPS = [
  { short: "Music", full: "Music & Recording" },
  { short: "Events", full: "Live Events & Festivals" },
  { short: "Visual", full: "Visual Arts & Media" },
  { short: "Tech", full: "Technology & Digital" },
  { short: "Community", full: "Cultural & Community Spaces" },
  { short: "Performing", full: "Performing Arts" },
  { short: "Gaming", full: "Gaming & Immersive" },
  { short: "Education", full: "Education & Development" },
];

const CategoryPills = ({ selectedCategories, onCategoryToggle }: CategoryPillsProps) => {
  // Check if any category from a group is selected
  const isGroupSelected = (fullName: string) => {
    const group = CATEGORY_GROUPS.find((g) => g.name === fullName);
    if (!group) return false;
    return group.categories.some((cat) => selectedCategories.includes(cat));
  };

  // Toggle all categories in a group
  const handleGroupToggle = (fullName: string) => {
    const group = CATEGORY_GROUPS.find((g) => g.name === fullName);
    if (!group) return;
    
    const isCurrentlySelected = isGroupSelected(fullName);
    
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
    <div className="w-full overflow-hidden">
      <div 
        className="flex gap-2 pb-2 overflow-x-auto"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#333 transparent'
        }}
      >
        {PILL_GROUPS.map(({ short, full }) => {
          const isSelected = isGroupSelected(full);
          return (
            <button
              key={full}
              onClick={() => handleGroupToggle(full)}
              title={full}
              className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-[#222] text-white border border-[#333] hover:bg-[#333]"
              }`}
            >
              {short.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPills;
