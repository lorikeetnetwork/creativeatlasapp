import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              100% FREE
            </Badge>
            <CardTitle className="text-2xl font-bold">
              Create a Free Account
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Sign up for free to explore Australia's creative directory. No credit card required.
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
              <span>View detailed profiles & contact info</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Filter by category, region & keywords</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              size="lg" 
              className="w-full gap-2" 
              onClick={() => navigate("/auth")}
            >
              <UserPlus className="w-4 h-4" />
              Create Free Account
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPromptOverlay;
