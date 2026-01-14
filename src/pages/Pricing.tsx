import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { User, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { PricingCard, PricingTier } from "@/components/pricing/PricingCard";
import { PricingHero } from "@/components/pricing/PricingHero";
import { FeatureComparison } from "@/components/pricing/FeatureComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingCTA } from "@/components/pricing/PricingCTA";

const pricingTiers: PricingTier[] = [
  {
    name: "Creator",
    price: 35,
    period: "year",
    description: "Full access for individual creatives",
    features: [
      "Browse all creative spaces",
      "Save favorite locations",
      "Create member profile",
      "Portfolio showcase",
      "RSVP & host events",
      "Opportunities board",
      "Publish blog articles",
      "Connect with creatives",
    ],
    cta: "Get Creator - $35/year",
    popular: true,
    icon: <User className="w-6 h-6" />,
  },
  {
    name: "Business",
    price: 55,
    period: "year",
    description: "For creative businesses & entities",
    features: [
      "Everything in Creator",
      "Business listing on map",
      "Full business profile page",
      "Photo & offerings galleries",
      "Videos & current projects",
      "Contact forms & social links",
      "Admin dashboard access",
      "Priority support",
    ],
    cta: "List Business - $55/year",
    icon: <Building2 className="w-6 h-6" />,
  },
];

const Pricing = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleTierSelect = async (tier: PricingTier) => {
    // Paid tiers - require auth and payment
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with payment"
      });
      navigate(`/auth?return=${encodeURIComponent('/pricing')}`);
      return;
    }

    setIsLoading(true);
    try {
      const paymentType = tier.name === "Creator" ? "basic_account" : "creative_listing";
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="container mx-auto px-4 md:px-6 pb-16">
        {/* Hero Section */}
        <PricingHero />

        {/* Pricing Cards */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {pricingTiers.map((tier, index) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                index={index}
                onSelect={() => handleTierSelect(tier)}
                isLoading={isLoading}
              />
            ))}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="max-w-4xl mx-auto mb-20 p-6 md:p-8 rounded-2xl border border-border bg-card">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Compare Plans
            </h2>
            <p className="text-muted-foreground">
              See all features side by side
            </p>
          </div>
          <FeatureComparison />
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <PricingFAQ />
        </section>

        {/* Final CTA */}
        <section className="max-w-4xl mx-auto">
          <PricingCTA />
        </section>
      </main>
    </div>
  );
};

export default Pricing;
