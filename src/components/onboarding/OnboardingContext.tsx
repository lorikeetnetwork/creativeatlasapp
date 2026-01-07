import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingContextType {
  isOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  completeOnboarding: () => Promise<void>;
  shouldShowOnboarding: boolean;
  checkOnboardingStatus: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShouldShowOnboarding(false);
        return;
      }

      // Check subscription status first - only show onboarding for subscribed users
      const { data: subscriptionData } = await supabase.functions.invoke('check-subscription');
      const isSubscribed = subscriptionData?.subscribed === true;
      
      if (!isSubscribed) {
        // Don't show onboarding for non-subscribers
        setShouldShowOnboarding(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();

      if (profile && !profile.onboarding_completed) {
        setShouldShowOnboarding(true);
        setIsOpen(true);
      } else {
        setShouldShowOnboarding(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShouldShowOnboarding(false);
    }
  }, []);

  const openOnboarding = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOpen(false);
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('profiles')
          .update({ onboarding_completed: true })
          .eq('id', session.user.id);
      }
      setShouldShowOnboarding(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Delay to allow profile creation and subscription verification
        setTimeout(checkOnboardingStatus, 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkOnboardingStatus]);

  return (
    <OnboardingContext.Provider
      value={{
        isOpen,
        openOnboarding,
        closeOnboarding,
        completeOnboarding,
        shouldShowOnboarding,
        checkOnboardingStatus,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
