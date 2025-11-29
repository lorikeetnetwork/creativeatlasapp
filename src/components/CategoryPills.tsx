import { CATEGORY_GROUPS } from "@/utils/categoryGroups";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
    <div className="relative flex items-center gap-1">
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#111111] rounded-full text-white hover:bg-[#333333] z-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      
      {/* Scrollable container */}
      <div 
        ref={scrollRef}
        onScroll={updateScrollButtons}
        className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
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

      {/* Right scroll button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#111111] rounded-full text-white hover:bg-[#333333] z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default CategoryPills;
