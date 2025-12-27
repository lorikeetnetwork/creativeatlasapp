import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, RefreshCw } from "lucide-react";

export const PricingHero = () => {
  return (
    <div className="text-center py-12 md:py-20 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Animated badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge 
          variant="outline" 
          className="mb-6 px-4 py-1.5 border-primary/30 text-primary bg-primary/5"
        >
          Simple & Transparent Pricing
        </Badge>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight"
      >
        Join Australia's{" "}
        <span className="text-primary relative">
          Creative Community
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/30 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
      >
        Affordable yearly plans to connect, discover, and grow with Australia's creative industry
      </motion.p>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span>Secure payments</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-primary" />
          <span>Cancel anytime</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <span>14-day money-back</span>
        </div>
      </motion.div>
    </div>
  );
};
