import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Map, Calendar, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../OnboardingContext';
import { StaggerContainer, StaggerItem } from '../OnboardingStep';

export const FinalStep: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();

  const handleAction = async (path: string) => {
    await completeOnboarding();
    navigate(path);
  };

  // Confetti particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 8,
  }));

  return (
    <StaggerContainer className="flex flex-col items-center text-center px-4 relative overflow-hidden">
      {/* Confetti animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: -20, x: `${particle.x}%`, opacity: 0 }}
            animate={{ 
              y: ['0%', '100%'],
              opacity: [1, 0],
              rotate: [0, 360],
            }}
            transition={{ 
              delay: particle.delay,
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute"
            style={{ 
              width: particle.size,
              height: particle.size,
              backgroundColor: `hsl(${(particle.id * 36) % 360}, 70%, 60%)`,
              borderRadius: particle.id % 2 === 0 ? '50%' : '0%',
            }}
          />
        ))}
      </div>

      <StaggerItem>
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Rocket className="w-10 h-10 text-primary-foreground" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
          </div>
        </motion.div>
      </StaggerItem>

      <StaggerItem>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          You're All Set!
        </h2>
      </StaggerItem>

      <StaggerItem>
        <p className="text-muted-foreground max-w-md mb-8">
          Start exploring Australia's creative landscape. Where would you like to go first?
        </p>
      </StaggerItem>

      <StaggerItem className="w-full max-w-xs">
        <div className="space-y-3">
          <Button
            onClick={() => handleAction('/map')}
            className="w-full justify-start gap-3"
            size="lg"
          >
            <Map className="w-5 h-5" />
            Explore the Map
          </Button>
          
          <Button
            onClick={() => handleAction('/events')}
            variant="outline"
            className="w-full justify-start gap-3"
            size="lg"
          >
            <Calendar className="w-5 h-5" />
            Browse Events
          </Button>
          
          <Button
            onClick={() => handleAction('/community/edit-profile')}
            variant="outline"
            className="w-full justify-start gap-3"
            size="lg"
          >
            <User className="w-5 h-5" />
            Complete Your Profile
          </Button>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};
