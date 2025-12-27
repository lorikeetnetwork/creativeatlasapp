import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../OnboardingStep';

export const WelcomeStep: React.FC = () => {
  return (
    <StaggerContainer className="flex flex-col items-center text-center px-4">
      <StaggerItem>
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
            <motion.div
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
          </div>
        </motion.div>
      </StaggerItem>

      <StaggerItem>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Welcome to Creative Atlas
        </h2>
      </StaggerItem>

      <StaggerItem>
        <p className="text-lg text-muted-foreground max-w-md mb-6">
          Australia's living map of creative spaces, venues, studios, and cultural organisations.
        </p>
      </StaggerItem>

      <StaggerItem>
        <div className="flex flex-wrap justify-center gap-2">
          {['Venues', 'Studios', 'Labels', 'Festivals', 'Co-working'].map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground border border-border"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};
