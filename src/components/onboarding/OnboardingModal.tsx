import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from './OnboardingContext';
import { OnboardingStep } from './OnboardingStep';
import { WelcomeStep } from './steps/WelcomeStep';
import { MapStep } from './steps/MapStep';
import { CommunityStep } from './steps/CommunityStep';
import { EventsStep } from './steps/EventsStep';
import { FinalStep } from './steps/FinalStep';

const STEPS = [
  { component: WelcomeStep, key: 'welcome' },
  { component: MapStep, key: 'map' },
  { component: CommunityStep, key: 'community' },
  { component: EventsStep, key: 'events' },
  { component: FinalStep, key: 'final' },
];

export const OnboardingModal: React.FC = () => {
  const { isOpen, closeOnboarding, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(async () => {
    await completeOnboarding();
    closeOnboarding();
  }, [completeOnboarding, closeOnboarding]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'Escape':
          handleSkip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleSkip]);

  // Reset step when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const StepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Close onboarding"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="pt-12 pb-6 px-6 min-h-[450px] flex flex-col">
              {/* Step content with animation */}
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <OnboardingStep key={STEPS[currentStep].key} direction={direction}>
                    <StepComponent />
                  </OnboardingStep>
                </AnimatePresence>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 my-6">
                {STEPS.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentStep ? 'forward' : 'backward');
                      setCurrentStep(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-primary'
                        : 'bg-muted hover:bg-muted-foreground/30'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              {!isLastStep && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Skip tour
                  </Button>

                  <div className="flex gap-2">
                    {!isFirstStep && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrev}
                        aria-label="Previous step"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    )}
                    <Button onClick={handleNext}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
