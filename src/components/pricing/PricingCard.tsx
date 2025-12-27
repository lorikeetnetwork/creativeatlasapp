import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon?: React.ReactNode;
}

interface PricingCardProps {
  tier: PricingTier;
  index: number;
  onSelect: () => void;
  isLoading?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.15, 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  })
};

const featureVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.05 }
  })
};

export const PricingCard = ({ tier, index, onSelect, isLoading }: PricingCardProps) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      whileHover={{ 
        scale: tier.popular ? 1.02 : 1.01,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "relative p-6 md:p-8 rounded-2xl border bg-card overflow-hidden transition-all duration-300",
        tier.popular 
          ? "border-primary/50 shadow-[0_0_40px_-10px] shadow-primary/20 md:scale-105 z-10" 
          : "border-border hover:border-primary/30"
      )}
    >
      {/* Popular badge */}
      {tier.popular && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-px left-1/2 -translate-x-1/2"
        >
          <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-b-lg text-sm font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Most Popular
          </div>
        </motion.div>
      )}

      {/* Glow effect for popular */}
      {tier.popular && (
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          {tier.icon && (
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              {tier.icon}
            </div>
          )}
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
          <p className="text-muted-foreground text-sm">{tier.description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl md:text-5xl font-bold text-foreground">
              ${tier.price}
            </span>
            <span className="text-muted-foreground text-sm">/{tier.period}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, i) => (
            <motion.li
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={featureVariants}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          className={cn(
            "w-full",
            tier.popular 
              ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25" 
              : "variant-outline"
          )}
          variant={tier.popular ? "default" : "outline"}
          size="lg"
          onClick={onSelect}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : tier.cta}
        </Button>
      </div>
    </motion.div>
  );
};
