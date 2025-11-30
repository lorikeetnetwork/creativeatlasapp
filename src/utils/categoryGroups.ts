// Simplified 12-category system for creative industries
export interface CategoryGroup {
  name: string;
  categories: string[];
}

// New flat category list - each category is its own group
export const CATEGORIES = [
  "Music Industry",
  "Audio, Production & Post-Production",
  "Visual Arts, Design & Craft",
  "Culture, Heritage & Community",
  "Events, Festivals & Live Performance",
  "Media, Content & Communications",
  "Education, Training & Professional Development",
  "Workspaces, Fabrication & Creative Infrastructure",
  "Creative Technology & Emerging Media",
  "Software, Development & Digital Platforms",
  "Media Infrastructure & Cloud Technology",
  "Business, Logistics & Support Services",
] as const;

export type Category = typeof CATEGORIES[number];

// Short display names for pills/UI
export const CATEGORY_SHORT_NAMES: Record<string, string> = {
  "Music Industry": "Music",
  "Audio, Production & Post-Production": "Audio",
  "Visual Arts, Design & Craft": "Visual",
  "Culture, Heritage & Community": "Culture",
  "Events, Festivals & Live Performance": "Events",
  "Media, Content & Communications": "Media",
  "Education, Training & Professional Development": "Education",
  "Workspaces, Fabrication & Creative Infrastructure": "Workspaces",
  "Creative Technology & Emerging Media": "Creative Tech",
  "Software, Development & Digital Platforms": "Software",
  "Media Infrastructure & Cloud Technology": "Infrastructure",
  "Business, Logistics & Support Services": "Business",
};

// For backwards compatibility - each category is its own "group"
export const CATEGORY_GROUPS: CategoryGroup[] = CATEGORIES.map(cat => ({
  name: cat,
  categories: [cat],
}));

// Utility functions
export function getAllCategories(): string[] {
  return [...CATEGORIES];
}

export function getCategoryGroupNames(): string[] {
  return [...CATEGORIES];
}

export function getCategoryGroup(category: string): string | null {
  return CATEGORIES.includes(category as Category) ? category : null;
}

export function getCategoriesByGroup(groupName: string): string[] {
  return CATEGORIES.includes(groupName as Category) ? [groupName] : [];
}

export function getShortName(category: string): string {
  return CATEGORY_SHORT_NAMES[category] || category;
}
