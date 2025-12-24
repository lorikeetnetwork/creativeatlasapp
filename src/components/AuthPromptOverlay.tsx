import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MapPin, UserPlus, LogIn } from "lucide-react";

const AuthPromptOverlay = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="max-w-md mx-4 shadow-2xl border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Sign In Required
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Create an account and subscribe to access Australia's creative directory.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Browse & explore all creative entities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Access Events, Opportunities & Community</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Create your member profile</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              size="lg" 
              className="w-full gap-2" 
              onClick={() => navigate("/auth")}
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full gap-2"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="w-4 h-4" />
              Already have an account? Sign In
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground pt-2">
            Starting from $15/year
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPromptOverlay;
