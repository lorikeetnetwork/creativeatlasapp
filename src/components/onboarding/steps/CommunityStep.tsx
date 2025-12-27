import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Heart, MessageSquare } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../OnboardingStep';

export const CommunityStep: React.FC = () => {
  const profiles = [
    { name: 'Alex M.', role: 'Producer', color: 'from-blue-500 to-purple-500' },
    { name: 'Sam K.', role: 'Designer', color: 'from-green-500 to-teal-500' },
    { name: 'Jordan R.', role: 'Artist', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <StaggerContainer className="flex flex-col items-center text-center px-4">
      <StaggerItem>
        <div className="relative mb-6">
          {/* Stacked profile cards */}
          <div className="relative w-56 h-32">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.name}
                initial={{ opacity: 0, y: 20, rotate: 0 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  rotate: (index - 1) * 8 
                }}
                transition={{ delay: index * 0.15 }}
                className="absolute left-1/2 -translate-x-1/2"
                style={{ 
                  zIndex: 3 - index,
                  top: index * 8,
                }}
              >
                <div className="w-40 bg-card border border-border rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${profile.color}`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">{profile.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Join the Community
        </h2>
      </StaggerItem>

      <StaggerItem>
        <p className="text-muted-foreground max-w-md mb-6">
          Connect with other creatives. Build your profile, showcase your work, and find collaborators.
        </p>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          {[
            { icon: Users, label: 'Connect' },
            { icon: Briefcase, label: 'Hire' },
            { icon: Heart, label: 'Collaborate' },
            { icon: MessageSquare, label: 'Mentor' },
          ].map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{label}</span>
            </motion.div>
          ))}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};
