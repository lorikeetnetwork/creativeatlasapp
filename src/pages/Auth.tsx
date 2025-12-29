import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { BentoPage, BentoContainer } from "@/components/ui/bento-page-layout";
import { useOnboarding } from "@/components/onboarding/OnboardingContext";
import { PasswordChangeModal } from "@/components/auth/PasswordChangeModal";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkOnboardingStatus } = useOnboarding();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/map");
      }
    });
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/map`,
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Welcome! Let us show you around...",
      });
      // Trigger onboarding for new users
      setTimeout(async () => {
        await checkOnboardingStatus();
        navigate("/map");
      }, 500);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.user) {
      // Check if user needs to change password
      const { data: profile } = await supabase
        .from("profiles")
        .select("must_change_password")
        .eq("id", data.user.id)
        .single();

      if (profile?.must_change_password) {
        setShowPasswordChange(true);
      } else {
        navigate("/map");
      }
    }
  };

  const handlePasswordChangeComplete = () => {
    setShowPasswordChange(false);
    navigate("/map");
  };

  return (
    <BentoPage>
      <Navbar />
      <PasswordChangeModal 
        open={showPasswordChange} 
        onComplete={handlePasswordChangeComplete} 
      />
      <div className="flex items-center justify-center p-4 py-12">
        <BentoContainer className="w-full max-w-md">
          <div className="space-y-3 text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-primary">
              <MapPin className="w-8 h-8" />
              <h1 className="text-3xl font-bold text-white">Creative Atlas</h1>
            </div>
            <h2 className="text-xl font-semibold text-white">Australia's Creative Directory</h2>
            <p className="text-gray-400">
              Connect with venues, studios, and creative spaces across Australia
            </p>
          </div>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#222] border border-[#333]">
              <TabsTrigger value="signin" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#222] border-[#333] text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#222] border-[#333] text-white placeholder:text-gray-500"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-[#222] border-[#333] text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#222] border-[#333] text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-[#222] border-[#333] text-white placeholder:text-gray-500"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </Button>
                <p className="text-xs text-center text-gray-400">
                  Subscription required after sign up to access all features.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </BentoContainer>
      </div>
    </BentoPage>
  );
};

export default Auth;
