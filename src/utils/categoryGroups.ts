// Organized category groups for better UI navigation

export interface CategoryGroup {
  name: string;
  categories: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: "Music & Recording",
    categories: [
      "Record Labels",
      "Music Venues",
      "Recording Studios",
      "Rehearsal Studios",
      "Post-Production Studios",
      "Music Publishers",
      "Music Distributors",
      "Micro-labels",
      "Sync Licensing Agencies",
      "Music Supervisors",
      "Composer Services",
      "Audio Sample Library Companies",
      "Music Data & Analytics Platforms",
      "Music Education Platforms & Tutors",
      "Instrument Makers & Luthiers",
      "Audio Hardware Manufacturers",
      "Music Monetisation Platforms",
      "Music Recommendation Engines",
      "Community Radio Stations",
      "Music Retailers & Instrument Stores",
      "Independent Artists & Bands",
      "DJs & Electronic Producers",
      "Audio Engineers & Mix/Mastering Services",
    ],
  },
  {
    name: "Live Events & Festivals",
    categories: [
      "Festivals & Live Event Organisers",
      "Cultural Festivals",
      "Event Production & Technical Services",
      "Lighting, Sound & Staging Companies",
      "Event Ticketing Platforms",
      "Festival Infrastructure Suppliers",
      "Backline Hire Companies",
      "Event Technology & RFID/NFC Systems",
      "Show Control & Live Event Software",
      "Hybrid Events & Virtual Venue Platforms",
    ],
  },
  {
    name: "Artist Services & Management",
    categories: [
      "Artist Management Agencies",
      "Booking Agencies",
      "Publicists & PR Agencies",
      "Marketing & Creative Communications Agencies",
      "Artist Services & Freelance Creative Providers",
      "Model & Talent Casting Agencies",
      "Location Scouts & Production Support",
      "Touring & Logistics Companies",
      "Creative Funding Consultants",
      "Cultural Strategy Consultancies",
      "Professional Guilds & Industry Associations",
    ],
  },
  {
    name: "Visual Arts & Media",
    categories: [
      "Film & TV Production Companies",
      "Art Galleries",
      "Photography Studios",
      "Videography Studios",
      "Animation & Motion Studios",
      "Design Studios",
      "Illustrators & Concept Artists",
      "Fashion & Textile Studios",
      "Creative Print Shops",
      "Zine Publishers & Micro-presses",
      "Art Supply Retailers",
      "Craft & Artisan Studios",
      "Streetwear & Creative Fashion Brands",
      "Production Companies",
    ],
  },
  {
    name: "Technology & Digital",
    categories: [
      "Music Technology Startups",
      "Creative Technology Labs",
      "Digital Media Agencies",
      "Web3 / Blockchain Creative Platforms",
      "Software Development Studios",
      "Full-Stack Development Agencies",
      "Frontend/Backend Developers",
      "App Development Studios",
      "Web Development Agencies",
      "Custom Platform Builders",
      "SaaS Creators",
      "Creative Technology Agencies",
      "Creative Tools & Software Providers",
      "Audio Plugin Developers",
      "DAW Developers",
      "Creative Tools & Productivity Software Makers",
    ],
  },
  {
    name: "AI & Machine Learning",
    categories: [
      "AI Research & Development Labs",
      "AI-Driven Creative Studios",
      "AI Video/Audio Generation Platforms",
      "AI Creative Production Studios",
      "AI Music Generation Platforms",
      "Machine Learning Engineers",
      "Data Science & Analytics Firms",
      "Data Engineering Services",
      "Digital Signal Processing Companies",
      "Audio AI Companies",
    ],
  },
  {
    name: "Gaming & Immersive",
    categories: [
      "Game Development Studios",
      "XR/AR/VR Studios",
      "Immersive Media Creators",
      "Immersive Technology Labs",
      "3D Modelling & Simulation Studios",
      "Virtual Production Studios",
      "Realtime Engine Specialists",
      "Game Audio & Interactive Sound Designers",
      "Interactive Media Designers",
      "Motion Capture Studios",
      "Projection Mapping Studios",
      "Generative Art Studios",
      "Creative Coding Studios",
      "Interactive Installation Technologists",
      "Metaverse Experience Builders",
    ],
  },
  {
    name: "Web3 & NFT",
    categories: [
      "NFT Art Platforms",
      "Digital Collectible Creators",
      "Smart Contract Developers",
      "Crowdfunding Platforms for Creators",
    ],
  },
  {
    name: "Cultural & Community Spaces",
    categories: [
      "Cultural Centres",
      "Community Arts Organisations",
      "Artist-Run Initiatives",
      "Creative Hubs & Coworking Spaces",
      "Creative Coworking/Hotdesk Spaces",
      "Cultural Heritage Organisations",
      "Museums & Exhibition Spaces",
      "Public Art Producers",
      "Indigenous Art Centres",
      "Regional Creative Networks",
      "Cultural Tourism Operators",
      "Civic & Urban Creative Placemaking Organisations",
      "Cultural Research & Policy Organisations",
      "Cultural Mapping Organisations",
      "Community Makers Markets",
      "Open Studios & Artist Exchanges",
    ],
  },
  {
    name: "Performing Arts",
    categories: [
      "Theatre Companies",
      "Dance Companies",
      "Immersive Theatre Companies",
      "Dance Schools & Academies",
      "Voiceover Studios",
      "Sound Art & Experimental Media Groups",
      "Lighting Designers & Visual Effects Artists",
    ],
  },
  {
    name: "Education & Development",
    categories: [
      "Education & Training Providers",
      "Talent Development Programs & Residencies",
      "Creative Workshops & Education Providers",
      "Creative Retreats & Residency Spaces",
      "Creative Incubators & Accelerators",
      "Public Music Programs & Youth Music Foundations",
      "Interdisciplinary Art–Tech Labs",
      "Arts Foundations & Funders",
      "Creative Social Enterprises",
    ],
  },
  {
    name: "Content & Media",
    categories: [
      "Content Creators & Creative Influencers",
      "Podcast Studios & Networks",
      "Live Streaming Production Studios",
      "Content Syndication Networks",
      "Independent Media Outlets",
      "Storytelling & Narrative Design Studios",
      "Artist Collectives & Creative Co-ops",
    ],
  },
  {
    name: "Platforms & Marketplaces",
    categories: [
      "Creative Marketplaces & Digital Platforms",
      "Online Creative Marketplaces",
      "E-commerce Platforms for Creators",
      "Multi-vendor Marketplace Platforms",
      "White-label Ticketing Providers",
      "Venue Discovery Platforms",
      "Artist Portfolio Platforms",
      "Creative Data & Metadata Services",
      "Archival & Digitisation Services",
    ],
  },
  {
    name: "Tech Infrastructure",
    categories: [
      "Streaming Technology Platforms",
      "Cloud Media Infrastructure Providers",
      "Cybersecurity for Creative Industries",
      "DevOps & Cloud Engineering Services",
      "API Providers & Developer Platforms",
      "Audio Infrastructure Platforms",
      "Video Encoding & Live-stream Tech",
      "Creative Automation Platforms",
      "DRM & Rights Management Services",
      "Asset Management & Metadata Software",
      "Digital Preservation Technology",
      "Lighting Control System Developers",
      "Projection Mapping Tech Providers",
    ],
  },
  {
    name: "Specialty Hardware & Tech",
    categories: [
      "Spatial Audio Technology Companies",
      "Embedded Systems for Art & Music",
      "Creative Robotics Labs",
      "IoT & Wearable Tech Designers",
      "Wearable Tech Creators",
      "Haptics & Sensory Experience Companies",
    ],
  },
  {
    name: "Fabrication & Production",
    categories: [
      "Makerspaces & Fab Labs",
      "Creative Fabrication Workshops",
      "3D Printing & Fabrication Tech Studios",
      "Digital Fabrication Labs",
      "Set Designers & Scenic Fabricators",
      "Prop & Costume Workshops",
      "Creative Industrial Designers",
    ],
  },
  {
    name: "Legacy Categories",
    categories: [
      "Venue",
      "Studio",
      "Festival",
      "Label",
      "Management",
      "Services",
      "Education",
      "Government/Peak Body",
      "Community Organisation",
      "Co-working/Creative Hub",
      "Gallery/Arts Space",
      "Other",
    ],
  },
];

// Get all categories as a flat array
export function getAllCategories(): string[] {
  return CATEGORY_GROUPS.flatMap((group) => group.categories);
}

// Get top-level group names for pills
export function getCategoryGroupNames(): string[] {
  return CATEGORY_GROUPS.map((group) => group.name);
}

// Find which group a category belongs to
export function getCategoryGroup(category: string): string | null {
  for (const group of CATEGORY_GROUPS) {
    if (group.categories.includes(category)) {
      return group.name;
    }
  }
  return null;
}

// Get categories by group name
export function getCategoriesByGroup(groupName: string): string[] {
  const group = CATEGORY_GROUPS.find((g) => g.name === groupName);
  return group?.categories || [];
}
