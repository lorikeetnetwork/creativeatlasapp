import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Building2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import logoImage from "@/assets/creative-atlas-logo.png";

const Pricing = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingBasic, setIsLoadingBasic] = useState(false);
  const [isLoadingListing, setIsLoadingListing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePayment = async (paymentType: 'basic_account' | 'creative_listing') => {
    // Check if user is logged in
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with payment",
      });
      navigate(`/auth?return=${encodeURIComponent('/pricing')}`);
      return;
    }

    const setLoading = paymentType === 'basic_account' ? setIsLoadingBasic : setIsLoadingListing;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-account-payment', {
        body: { payment_type: paymentType }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to payment",
          description: "Complete your payment in the new window",
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const basicFeatures = [
    "Browse all locations on the map",
    "Search and filter creative spaces",
    "Save favorite locations",
    "Access contact information",
    "Community member status",
  ];

  const listingFeatures = [
    "Everything in Basic Account",
    "Your location on the map",
    "Full business profile page",
    "Photo & offerings galleries",
    "Videos & current projects",
    "Contact forms & social links",
    "Admin dashboard access",
    "Priority support",
  ];

  const comparisonFeatures = [
    { name: "Map browsing", basic: true, listing: true },
    { name: "Search & filters", basic: true, listing: true },
    { name: "Save favorites", basic: true, listing: true },
    { name: "Location on map", basic: false, listing: true },
    { name: "Business profile page", basic: false, listing: true },
    { name: "Photo gallery", basic: false, listing: true },
    { name: "Offerings showcase", basic: false, listing: true },
    { name: "Video embeds", basic: false, listing: true },
    { name: "Current projects", basic: false, listing: true },
    { name: "Contact forms", basic: false, listing: true },
    { name: "Admin dashboard", basic: false, listing: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src={logoImage} 
              alt="Creative Atlas" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/map")}>
              Explore Map
            </Button>
            {!session ? (
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/map")}>
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">One-Time Payments</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Creative Atlas Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            One-time payments. No subscriptions. Own your presence in Australia's creative community.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {/* Basic Account Card */}
          <Card className="hover-scale">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  For Explorers
                </Badge>
              </div>
              <CardTitle className="text-3xl">Basic User Account</CardTitle>
              <CardDescription className="text-lg mt-2">
                Browse and discover creative spaces
              </CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold">$5</span>
                <span className="text-muted-foreground ml-2">AUD one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handlePayment('basic_account')}
                disabled={isLoadingBasic}
              >
                {isLoadingBasic ? "Processing..." : "Get Started - $5"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Creative Listing Card */}
          <Card className="hover-scale border-primary/50 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="gap-2 border-primary text-primary">
                  <Building2 className="w-4 h-4" />
                  For Creative Businesses
                </Badge>
              </div>
              <CardTitle className="text-3xl">Creative Entity Listing</CardTitle>
              <CardDescription className="text-lg mt-2">
                Full business profile with showcase features
              </CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold">$15</span>
                <span className="text-muted-foreground ml-2">AUD one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {listingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className={index === 0 ? "text-muted-foreground" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handlePayment('creative_listing')}
                disabled={isLoadingListing}
              >
                {isLoadingListing ? "Processing..." : "List Your Business - $15"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Comparison</h2>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4">Feature</th>
                      <th className="text-center py-4 px-4">Basic ($5)</th>
                      <th className="text-center py-4 px-4">Listing ($15)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-4 px-4">{feature.name}</td>
                        <td className="text-center py-4 px-4">
                          {feature.basic ? (
                            <Check className="w-5 h-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="text-center py-4 px-4">
                          {feature.listing ? (
                            <Check className="w-5 h-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What happens after I pay?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  After completing your payment, your account will be upgraded immediately. For Creative Entity Listings, 
                  you'll be guided through setting up your business profile with photos, videos, and contact information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I upgrade later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! If you start with a Basic Account, you can upgrade to a Creative Entity Listing at any time 
                  by paying the difference ($10 AUD).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How long does my listing stay active?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your listing remains active permanently. This is a one-time payment with no recurring fees. 
                  You maintain full control over your profile and can update it anytime.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 14-day money-back guarantee if you're not satisfied with your purchase. 
                  Contact our support team for assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Australia's Creative Community?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start exploring creative spaces or showcase your own business today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/map")}>
              Explore the Map
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
