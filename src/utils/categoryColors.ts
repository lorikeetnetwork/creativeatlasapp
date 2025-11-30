// 12 distinct colors for the simplified category system
export const CATEGORY_COLORS: Record<string, string> = {
  // Music Industry - Purple
  "Music Industry": "#9C27B0",
  
  // Audio, Production & Post-Production - Deep Purple
  "Audio, Production & Post-Production": "#673AB7",
  
  // Visual Arts, Design & Craft - Pink
  "Visual Arts, Design & Craft": "#E91E63",
  
  // Culture, Heritage & Community - Green
  "Culture, Heritage & Community": "#4CAF50",
  
  // Events, Festivals & Live Performance - Orange
  "Events, Festivals & Live Performance": "#FF9800",
  
  // Media, Content & Communications - Yellow
  "Media, Content & Communications": "#FFC107",
  
  // Education, Training & Professional Development - Lime
  "Education, Training & Professional Development": "#CDDC39",
  
  // Workspaces, Fabrication & Creative Infrastructure - Brown
  "Workspaces, Fabrication & Creative Infrastructure": "#795548",
  
  // Creative Technology & Emerging Media - Indigo
  "Creative Technology & Emerging Media": "#3F51B5",
  
  // Software, Development & Digital Platforms - Blue
  "Software, Development & Digital Platforms": "#2196F3",
  
  // Media Infrastructure & Cloud Technology - Cyan
  "Media Infrastructure & Cloud Technology": "#00BCD4",
  
  // Business, Logistics & Support Services - Blue Grey
  "Business, Logistics & Support Services": "#607D8B",
  
  // Fallback for legacy/unmapped categories
  "Other": "#9E9E9E",
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"];
}

export function getUniqueColors(): string[] {
  return [...new Set(Object.values(CATEGORY_COLORS))];
}
