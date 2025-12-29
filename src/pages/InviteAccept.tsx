import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Loader2, CheckCircle, XCircle, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { BentoPage, BentoContainer } from "@/components/ui/bento-page-layout";

type InviteState = "loading" | "verified" | "password-setup" | "error" | "complete";

const InviteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [state, setState] = useState<InviteState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{ email: string; fullName: string } | null>(null);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setState("error");
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-invite-token", {
        body: { token },
      });

      if (error) throw error;

      if (data.error) {
        setError(data.error);
        setState("error");
        return;
      }

      setUserInfo({ email: data.email, fullName: data.fullName });

      // Sign in with the temp password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.tempPassword,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        setError("Failed to process invitation. Please contact support.");
        setState("error");
        return;
      }

      setState("password-setup");
    } catch (err) {
      console.error("Token verification error:", err);
      setError("Failed to verify invitation. The link may be invalid or expired.");
      setState("error");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Update the password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) throw passwordError;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update profile to remove must_change_password flag
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ must_change_password: false })
          .eq("id", user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
        }
      }

      setState("complete");

      toast({
        title: "Welcome to Creative Atlas!",
        description: "Your account is ready. Redirecting...",
      });

      setTimeout(() => {
        navigate("/map");
      }, 2000);

    } catch (error) {
      console.error("Password setup error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoPage>
      <Navbar />
      <div className="flex items-center justify-center p-4 py-12 min-h-[80vh]">
        <BentoContainer className="w-full max-w-md">
          <div className="space-y-3 text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-primary">
              <MapPin className="w-8 h-8" />
              <h1 className="text-3xl font-bold text-white">Creative Atlas</h1>
            </div>
          </div>

          {state === "loading" && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-400">Verifying your invitation...</p>
            </div>
          )}

          {state === "error" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Invitation Error</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button onClick={() => navigate("/auth")} variant="outline">
                Go to Sign In
              </Button>
            </div>
          )}

          {state === "password-setup" && userInfo && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Welcome, {userInfo.fullName}!
                </h2>
                <p className="text-gray-400">
                  Set a password to complete your account setup.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    disabled
                    className="bg-[#222] border-[#333] text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className="bg-[#222] border-[#333] text-white placeholder:text-gray-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-[#222] border-[#333] text-white placeholder:text-gray-500"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </form>
            </div>
          )}

          {state === "complete" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Account Ready!</h2>
              <p className="text-gray-400 mb-4">Redirecting you to Creative Atlas...</p>
              <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
            </div>
          )}
        </BentoContainer>
      </div>
    </BentoPage>
  );
};

export default InviteAccept;
