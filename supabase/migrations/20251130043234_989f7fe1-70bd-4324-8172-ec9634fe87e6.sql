-- Map existing locations to new categories
UPDATE locations SET category = 'Events, Festivals & Live Performance' WHERE category = 'Venue';
UPDATE locations SET category = 'Culture, Heritage & Community' WHERE category = 'Community Organisation';
UPDATE locations SET category = 'Business, Logistics & Support Services' WHERE category = 'Other';