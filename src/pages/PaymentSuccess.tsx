import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, Building2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/creative-atlas-logo.png";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [accountType, setAccountType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const paymentType = searchParams.get('type');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId }
        });

        if (error) throw error;

        if (data?.success) {
          setAccountType(data.account_type);
          toast({
            title: "Payment successful!",
            description: "Your account has been upgraded",
          });
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        toast({
          title: "Verification error",
          description: "We're processing your payment. Please check back shortly.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, toast]);

  const isBasicAccount = paymentType === 'basic_account';
  const Icon = isBasicAccount ? Sparkles : Building2;

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
        </div>
      </header>

      {/* Success Content */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {isVerifying ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">Verifying your payment...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Payment Successful! 🎉</h1>
                <p className="text-xl text-muted-foreground">
                  Welcome to Creative Atlas
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <CardTitle>
                      {isBasicAccount ? "Basic User Account" : "Creative Entity Listing"}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Your account has been upgraded successfully
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isBasicAccount ? (
                    <>
                      <div>
                        <h3 className="font-semibold mb-3">You now have access to:</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>✓ Full map browsing with search and filters</li>
                          <li>✓ Save and organize your favorite locations</li>
                          <li>✓ Access detailed contact information</li>
                          <li>✓ Community member status</li>
                        </ul>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm">
                          <strong>Want to list your own creative space?</strong><br />
                          Upgrade to a Creative Entity Listing for just $10 more to get your business on the map 
                          with a full profile page, galleries, and contact forms.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          className="flex-1" 
                          size="lg"
                          onClick={() => navigate("/map")}
                        >
                          Start Exploring
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button 
                          className="flex-1" 
                          variant="outline"
                          size="lg"
                          onClick={() => navigate("/pricing")}
                        >
                          Upgrade to Listing
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold mb-3">Your business profile includes:</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>✓ Your location pinned on the map</li>
                          <li>✓ Dedicated business profile page</li>
                          <li>✓ Photo and offerings galleries</li>
                          <li>✓ Video embeds and current projects</li>
                          <li>✓ Contact forms and social links</li>
                          <li>✓ Full admin dashboard access</li>
                        </ul>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium mb-2">🚀 Next Steps:</p>
                        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                          <li>Submit your location details</li>
                          <li>Upload photos and videos</li>
                          <li>Add your offerings and services</li>
                          <li>Complete your business profile</li>
                        </ol>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          className="flex-1" 
                          size="lg"
                          onClick={() => navigate("/map")}
                        >
                          Add Your Location
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button 
                          className="flex-1" 
                          variant="outline"
                          size="lg"
                          onClick={() => navigate("/dashboard")}
                        >
                          View Dashboard
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">
                  Questions? Email us at support@creativeatlas.com.au
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PaymentSuccess;
