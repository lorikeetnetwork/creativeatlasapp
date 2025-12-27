import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ticket, Briefcase, TrendingUp } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../OnboardingStep';

export const EventsStep: React.FC = () => {
  const events = [
    { title: 'Live Music Night', date: 'Sat 15', type: 'Event' },
    { title: 'Sound Designer Role', date: 'Open', type: 'Job' },
    { title: 'Artist Residency', date: 'Apply now', type: 'Grant' },
  ];

  return (
    <StaggerContainer className="flex flex-col items-center text-center px-4">
      <StaggerItem>
        <div className="mb-6 space-y-2">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ x: 5 }}
              className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg w-64"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {event.type === 'Event' && <Calendar className="w-5 h-5 text-primary" />}
                {event.type === 'Job' && <Briefcase className="w-5 h-5 text-primary" />}
                {event.type === 'Grant' && <TrendingUp className="w-5 h-5 text-primary" />}
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.date}</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                <Ticket className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Events & Opportunities
        </h2>
      </StaggerItem>

      <StaggerItem>
        <p className="text-muted-foreground max-w-md mb-6">
          Discover events, gigs, grants, and job opportunities across Australia's creative industry.
        </p>
      </StaggerItem>

      <StaggerItem>
        <div className="flex flex-wrap justify-center gap-2">
          {['Workshops', 'Concerts', 'Exhibitions', 'Jobs', 'Grants'].map((tag) => (
            <motion.span
              key={tag}
              whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--primary))' }}
              className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground border border-border transition-colors cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
};
