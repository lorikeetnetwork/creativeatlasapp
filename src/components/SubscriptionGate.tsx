import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

interface SubscriptionGateProps {
  children: ReactNode;
  featureName?: string;
}

export const SubscriptionGate = ({ children, featureName = "this feature" }: SubscriptionGateProps) => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, isSubscribed, session } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Navbar session={session} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Navbar session={session} />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-lg mx-auto">
            <Card className="border-[#333] bg-[#1a1a1a] text-center">
              <CardHeader className="pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-white">Sign In Required</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Create an account and subscribe to access {featureName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate(`/auth?return=${encodeURIComponent(window.location.pathname)}`)}
                >
                  Sign In or Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-sm text-gray-500">
                  Starting from $35/year
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Navbar session={session} />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-lg mx-auto">
            <Card className="border-primary/30 bg-[#1a1a1a] text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <CardHeader className="pb-4 relative">
                <Badge className="mx-auto mb-4 bg-primary/20 text-primary border-primary/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Feature
                </Badge>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-white">Subscription Required</CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Upgrade your account to access {featureName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative">
                <div className="bg-[#252525] rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-3">With a subscription you get:</p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Access to Events & Calendar
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Opportunities Board
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Community Directory
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Blog & Articles
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Member Profile
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <a href="/#membership">
                    <Button 
                      className="w-full" 
                      size="lg"
                    >
                      View Pricing Plans
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                  <p className="text-xs text-gray-500">
                    Starting from just $35/year
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and subscribed - render the children
  return <>{children}</>;
};
