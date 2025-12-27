import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";

const stats = [
  { icon: MapPin, value: "500+", label: "Creative Spaces" },
  { icon: Users, value: "Growing", label: "Community" },
  { icon: Calendar, value: "100+", label: "Events Monthly" },
];

export const PricingCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-8 md:p-12"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA content */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ready to Join the Community?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start exploring creative spaces or showcase your own business today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/map")}
              className="shadow-lg shadow-primary/25"
            >
              Explore the Map
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/auth")}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
