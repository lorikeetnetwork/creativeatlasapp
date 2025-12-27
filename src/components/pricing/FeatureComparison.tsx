import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  free: boolean | string;
  creator: boolean | string;
  business: boolean | string;
  category?: string;
}

const features: Feature[] = [
  // Map & Discovery
  { name: "Browse all creative spaces", free: true, creator: true, business: true, category: "Map & Discovery" },
  { name: "View location details", free: true, creator: true, business: true },
  { name: "Save favorite locations", free: false, creator: true, business: true },
  { name: "Advanced filters & search", free: false, creator: true, business: true },
  
  // Community
  { name: "Community member directory", free: false, creator: true, business: true, category: "Community" },
  { name: "Create member profile", free: false, creator: true, business: true },
  { name: "Portfolio showcase", free: false, creator: true, business: true },
  { name: "Connect with creatives", free: false, creator: true, business: true },
  
  // Events & Opportunities
  { name: "View upcoming events", free: true, creator: true, business: true, category: "Events & Opportunities" },
  { name: "RSVP to events", free: false, creator: true, business: true },
  { name: "Create & host events", free: false, creator: true, business: true },
  { name: "Opportunities board access", free: false, creator: true, business: true },
  { name: "Post opportunities", free: false, creator: true, business: true },
  
  // Content & Blog
  { name: "Read articles & resources", free: true, creator: true, business: true, category: "Content & Blog" },
  { name: "Publish blog articles", free: false, creator: true, business: true },
  { name: "Comment & engage", free: false, creator: true, business: true },
  
  // Business Features
  { name: "Business listing on map", free: false, creator: false, business: true, category: "Business Features" },
  { name: "Full business profile page", free: false, creator: false, business: true },
  { name: "Photo & offerings galleries", free: false, creator: false, business: true },
  { name: "Videos & current projects", free: false, creator: false, business: true },
  { name: "Contact forms & social links", free: false, creator: false, business: true },
  { name: "Admin dashboard", free: false, creator: false, business: true },
  { name: "Priority support", free: false, creator: false, business: true },
];

const FeatureCell = ({ value }: { value: boolean | string }) => {
  if (typeof value === "string") {
    return <span className="text-sm text-foreground">{value}</span>;
  }
  return value ? (
    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
      <Check className="w-3 h-3 text-primary" />
    </div>
  ) : (
    <Minus className="w-4 h-4 text-muted-foreground/50 mx-auto" />
  );
};

export const FeatureComparison = () => {
  let currentCategory = "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-auto"
    >
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-border mb-4">
          <div className="text-left">
            <span className="text-sm font-medium text-muted-foreground">Features</span>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-foreground">Free</span>
            <p className="text-xs text-muted-foreground mt-0.5">$0</p>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-primary">Creator</span>
            <p className="text-xs text-muted-foreground mt-0.5">$15/year</p>
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-foreground">Business</span>
            <p className="text-xs text-muted-foreground mt-0.5">$20/year</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-1">
          {features.map((feature, index) => {
            const showCategory = feature.category && feature.category !== currentCategory;
            if (feature.category) currentCategory = feature.category;

            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02 }}
              >
                {showCategory && (
                  <div className="pt-4 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {feature.category}
                    </span>
                  </div>
                )}
                <div 
                  className={cn(
                    "grid grid-cols-4 gap-4 py-3 rounded-lg transition-colors",
                    "hover:bg-muted/50"
                  )}
                >
                  <div className="text-sm text-foreground">{feature.name}</div>
                  <div className="flex justify-center items-center">
                    <FeatureCell value={feature.free} />
                  </div>
                  <div className="flex justify-center items-center">
                    <FeatureCell value={feature.creator} />
                  </div>
                  <div className="flex justify-center items-center">
                    <FeatureCell value={feature.business} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
