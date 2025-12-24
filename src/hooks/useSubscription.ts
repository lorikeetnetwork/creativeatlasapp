import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface SubscriptionState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  isAdmin: boolean;
  subscriptionStatus: string | null;
  accountType: string | null;
  subscriptionEnd: string | null;
  user: User | null;
  session: Session | null;
}

export const useSubscription = () => {
  const [state, setState] = useState<SubscriptionState>({
    isLoading: true,
    isAuthenticated: false,
    isSubscribed: false,
    isAdmin: false,
    subscriptionStatus: null,
    accountType: null,
    subscriptionEnd: null,
    user: null,
    session: null,
  });

  const checkSubscription = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        isSubscribed: false,
        isAdmin: false,
        subscriptionStatus: null,
        accountType: null,
        subscriptionEnd: null,
        user: null,
        session: null,
      }));
      return;
    }

    try {
      // First check if user has admin/owner role - they get full access
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);
      
      const isAdmin = roles?.some(r => r.role === 'admin' || r.role === 'owner') ?? false;
      
      // If admin, grant full access immediately
      if (isAdmin) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          isSubscribed: true, // Admins get full access
          isAdmin: true,
          subscriptionStatus: 'admin',
          accountType: 'admin',
          subscriptionEnd: null,
          user: session.user,
          session,
        });
        return;
      }

      // Check subscription via edge function for non-admins
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        // Fallback to profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_type, subscription_status, subscription_end_date')
          .eq('id', session.user.id)
          .single();

        const isSubscribed = profile?.subscription_status === 'active' || 
                            profile?.account_type === 'basic_paid' || 
                            profile?.account_type === 'creative_entity';

        setState({
          isLoading: false,
          isAuthenticated: true,
          isSubscribed,
          isAdmin: false,
          subscriptionStatus: profile?.subscription_status || null,
          accountType: profile?.account_type || null,
          subscriptionEnd: profile?.subscription_end_date || null,
          user: session.user,
          session,
        });
        return;
      }

      const isSubscribed = data?.subscribed === true;

      setState({
        isLoading: false,
        isAuthenticated: true,
        isSubscribed,
        isAdmin: false,
        subscriptionStatus: data?.subscription_status || null,
        accountType: null, // Will be updated from profile
        subscriptionEnd: data?.subscription_end || null,
        user: session.user,
        session,
      });

      // Also fetch profile for account type
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setState(prev => ({
          ...prev,
          accountType: profile.account_type,
        }));
      }
    } catch (err) {
      console.error('Subscription check failed:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        isSubscribed: false,
        isAdmin: false,
        user: session.user,
        session,
      }));
    }
  }, []);

  const refreshSubscription = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await checkSubscription(session);
  }, [checkSubscription]);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
        }));
        
        // Defer subscription check
        if (session) {
          setTimeout(() => {
            checkSubscription(session);
          }, 0);
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isSubscribed: false,
            isAdmin: false,
            subscriptionStatus: null,
            accountType: null,
            subscriptionEnd: null,
          }));
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSubscription(session);
    });

    return () => subscription.unsubscribe();
  }, [checkSubscription]);

  return {
    ...state,
    refreshSubscription,
  };
};
