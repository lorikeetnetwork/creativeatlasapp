import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, ArrowRight, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import {
  BentoPage,
  BentoMain,
  BentoContainer,
  BentoContentCard,
} from "@/components/ui/bento-page-layout";

const Pricing = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingListing, setIsLoadingListing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handlePayment = async (paymentType: 'basic_account' | 'creative_listing') => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with payment"
      });
      navigate(`/auth?return=${encodeURIComponent('/pricing')}`);
      return;
    }
    setIsLoadingListing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-account-payment', {
        body: { payment_type: paymentType }
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to payment",
          description: "Complete your payment in the new window"
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsLoadingListing(false);
    }
  };

  const listingFeatures = ["Your location on the map", "Full business profile page", "Photo & offerings galleries", "Videos & current projects", "Contact forms & social links", "Admin dashboard access", "Priority support"];

  return (
    <BentoPage>
      <Navbar session={session} />

      {/* Hero Section */}
      <BentoContainer className="mx-4 md:mx-8 mt-8 text-center">
        <Badge className="mb-4 bg-[#333] text-white border-[#444]">Yearly Subscription</Badge>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
          Join Australia's Creative Community
        </h1>
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
          Affordable yearly plans for all users and creative businesses.
        </p>
      </BentoContainer>

      {/* Pricing Cards */}
      <BentoMain className="container mx-auto">
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 grid md:grid-cols-2 gap-6">
          {/* Basic User Card */}
          <BentoContainer>
            <div className="text-center mb-6">
              <Badge variant="outline" className="gap-2 border-[#444] text-white mb-4">
                For All Users
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Basic Account</h2>
              <p className="text-base md:text-lg mt-2 text-gray-400">
                Full access to browse and save creative spaces
              </p>
              <div className="mt-4 md:mt-6">
                <span className="text-5xl md:text-6xl font-bold text-white">$15</span>
                <span className="text-gray-400 ml-2 text-sm md:text-base">AUD/year</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {["Browse all creative spaces", "Save favorite locations", "Access to full map features", "Community updates", "Priority notifications"].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <GradientButton 
              className="w-full text-sm md:text-base" 
              size="lg" 
              variant="outline"
              onClick={() => handlePayment('basic_account')} 
              disabled={isLoadingListing}
            >
              {isLoadingListing ? "Processing..." : "Get Basic - $15/year"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </GradientButton>
          </BentoContainer>

          {/* Creative Listing Card */}
          <BentoContainer className="border-primary/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
              <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
            <div className="text-center mb-6">
              <Badge variant="outline" className="gap-2 border-[#444] text-white mb-4">
                <Building2 className="w-4 h-4" />
                For Creative Businesses
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Creative Entity Listing</h2>
              <p className="text-base md:text-lg mt-2 text-gray-400">
                Full business profile with showcase features
              </p>
              <div className="mt-4 md:mt-6">
                <span className="text-5xl md:text-6xl font-bold text-white">$20</span>
                <span className="text-gray-400 ml-2 text-sm md:text-base">AUD/year</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {listingFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <GradientButton 
              className="w-full text-sm md:text-base" 
              size="lg" 
              onClick={() => handlePayment('creative_listing')} 
              disabled={isLoadingListing}
            >
              {isLoadingListing ? "Processing..." : "List Your Business - $20/year"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </GradientButton>
          </BentoContainer>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4 md:space-y-6">
            <BentoContentCard title="What happens after I pay?">
              <p className="text-sm md:text-base text-gray-400">
                After completing your payment, your account will be upgraded immediately. For Creative Entity Listings, 
                you'll be guided through setting up your business profile with photos, videos, and contact information.
              </p>
            </BentoContentCard>

            <BentoContentCard title="What's included with a subscription?">
              <p className="text-sm md:text-base text-gray-400">
                A subscription unlocks access to all features including Events, Opportunities Board, 
                Community Directory, Blog, and the ability to create your own member profile. 
                You can browse the map for free, but premium features require a subscription.
              </p>
            </BentoContentCard>

            <BentoContentCard title="How does the yearly subscription work?">
              <p className="text-sm md:text-base text-gray-400">
                Your subscription renews annually. You maintain full control over your profile and can update it anytime.
                Cancel anytime before renewal to stop future charges.
              </p>
            </BentoContentCard>

            <BentoContentCard title="Do you offer refunds?">
              <p className="text-sm md:text-base text-gray-400">
                We offer a 14-day money-back guarantee if you're not satisfied with your purchase. 
                Contact our support team for assistance.
              </p>
            </BentoContentCard>
          </div>
        </div>

        {/* Footer CTA */}
        <BentoContainer className="mt-12 md:mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to Join Australia's Creative Community?</h2>
          <p className="text-base md:text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
            Start exploring creative spaces or showcase your own business today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <GradientButton size="lg" onClick={() => navigate("/map")}>
              Explore the Map
            </GradientButton>
            <GradientButton size="lg" variant="outline" onClick={() => navigate("/auth")} className="border-[#333] text-white hover:bg-[#222]">
              Get Started
            </GradientButton>
          </div>
        </BentoContainer>
      </BentoMain>
    </BentoPage>
  );
};

export default Pricing;
