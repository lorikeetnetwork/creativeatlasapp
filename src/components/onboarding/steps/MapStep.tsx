import React from 'react';
import { motion } from 'framer-motion';
import { Map, Building2, Music, Palette } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../OnboardingStep';

export const MapStep: React.FC = () => {
  const markers = [
    { top: '30%', left: '25%', delay: 0 },
    { top: '45%', left: '70%', delay: 0.2 },
    { top: '60%', left: '40%', delay: 0.4 },
    { top: '35%', left: '55%', delay: 0.6 },
    { top: '55%', left: '20%', delay: 0.8 },
  ];

  return (
    <StaggerContainer className="flex flex-col items-center text-center px-4">
      <StaggerItem>
        <div className="relative w-64 h-48 mb-6 rounded-xl bg-muted/50 border border-border overflow-hidden">
          {/* Animated map background */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"
          />
          
          {/* Map grid lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute w-full h-px bg-border" style={{ top: `${(i + 1) * 20}%` }} />
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute h-full w-px bg-border" style={{ left: `${(i + 1) * 20}%` }} />
            ))}
          </div>

          {/* Animated markers */}
          {markers.map((marker, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: marker.delay, duration: 0.3, type: 'spring' }}
              className="absolute"
              style={{ top: marker.top, left: marker.left }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ delay: marker.delay, duration: 1.5, repeat: Infinity }}
              >
                <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />
              </motion.div>
            </motion.div>
          ))}

          {/* Map icon overlay */}
          <div className="absolute bottom-3 right-3 opacity-30">
            <Map className="w-8 h-8 text-foreground" />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Discover the Map
        </h2>
      </StaggerItem>

      <StaggerItem>
        <p className="text-muted-foreground max-w-md mb-6">
          Explore 400+ creative spaces across Australia. Find venues, recording studios, galleries, and more.
        </p>
      </StaggerItem>

      <StaggerItem>
        <div className="flex justify-center gap-4">
          {[
            { icon: Building2, label: 'Venues' },
            { icon: Music, label: 'Studios' },
            { icon: Palette, label: 'Galleries' },
          ].map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{label}</span>
            </motion.div>
          ))}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};
