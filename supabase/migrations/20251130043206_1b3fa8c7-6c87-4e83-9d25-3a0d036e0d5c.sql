-- Add the 12 new category values to location_category enum
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Music Industry';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Audio, Production & Post-Production';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Visual Arts, Design & Craft';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Culture, Heritage & Community';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Events, Festivals & Live Performance';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Media, Content & Communications';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Education, Training & Professional Development';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Workspaces, Fabrication & Creative Infrastructure';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Creative Technology & Emerging Media';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Software, Development & Digital Platforms';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Media Infrastructure & Cloud Technology';
ALTER TYPE location_category ADD VALUE IF NOT EXISTS 'Business, Logistics & Support Services';