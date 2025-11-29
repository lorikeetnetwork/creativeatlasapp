import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import logoImage from "@/assets/creative-atlas-logo.png";

const Pricing = () => {
  const [session, setSession] = useState<Session | null>(null);
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

  const handlePayment = async () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue with payment",
      });
      navigate(`/auth?return=${encodeURIComponent('/pricing')}`);
      return;
    }

    setIsLoadingListing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-account-payment', {
        body: { payment_type: 'creative_listing' }
      });

      if (error) throw error;

      if (data?.url) {
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
      setIsLoadingListing(false);
    }
  };

  const listingFeatures = [
    "Your location on the map",
    "Full business profile page",
    "Photo & offerings galleries",
    "Videos & current projects",
    "Contact forms & social links",
    "Admin dashboard access",
    "Priority support",
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="border-b border-[#333] bg-[#121212]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src={logoImage} 
              alt="Creative Atlas" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("/map")}>
              Explore Map
            </Button>
            {!session ? (
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            ) : (
              <Button onClick={() => navigate("/map")}>
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-[#333] text-white border-[#444]">One-Time Payment</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            List Your Creative Business
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Free to browse. One-time payment to list your business on Australia's creative community map.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-20">
          {/* Creative Listing Card */}
          <Card className="border-[#333] bg-[#1a1a1a]">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Badge variant="outline" className="gap-2 border-[#444] text-white">
                  <Building2 className="w-4 h-4" />
                  For Creative Businesses
                </Badge>
              </div>
              <CardTitle className="text-4xl text-white">Creative Entity Listing</CardTitle>
              <CardDescription className="text-lg mt-2 text-gray-400">
                Full business profile with showcase features
              </CardDescription>
              <div className="mt-6">
                <span className="text-6xl font-bold text-white">$15</span>
                <span className="text-gray-400 ml-2">AUD one-time</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {listingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePayment}
                disabled={isLoadingListing}
              >
                {isLoadingListing ? "Processing..." : "List Your Business - $15"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="border-[#333] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">What happens after I pay?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  After completing your payment, your account will be upgraded immediately. For Creative Entity Listings, 
                  you'll be guided through setting up your business profile with photos, videos, and contact information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#333] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">Is it really free to browse?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Yes! You can create a free account and browse all locations on the map with no payment required. 
                  Only pay if you want to list your creative business.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#333] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">How long does my listing stay active?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Your listing remains active permanently. This is a one-time payment with no recurring fees. 
                  You maintain full control over your profile and can update it anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#333] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  We offer a 14-day money-back guarantee if you're not satisfied with your purchase. 
                  Contact our support team for assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Join Australia's Creative Community?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start exploring creative spaces or showcase your own business today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/map")}>
              Explore the Map
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="border-[#333] text-white hover:bg-[#1a1a1a]">
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
