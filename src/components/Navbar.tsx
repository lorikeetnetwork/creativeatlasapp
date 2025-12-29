import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/creative-atlas-logo.png";
import type { Session } from "@supabase/supabase-js";

interface NavbarProps {
  session?: Session | null;
}

const Navbar = ({ session: propSession }: NavbarProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(propSession ?? null);
  const [hasCollaboratorAccess, setHasCollaboratorAccess] = useState(false);

  useEffect(() => {
    // If session is passed as prop, use it
    if (propSession !== undefined) {
      setSession(propSession);
    } else {
      // Otherwise, fetch session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, [propSession]);

  // Check for collaborator/admin access when session changes
  useEffect(() => {
    const checkAccess = async () => {
      if (!session?.user) {
        setHasCollaboratorAccess(false);
        return;
      }

      try {
        const [collaboratorResult, adminResult] = await Promise.all([
          supabase.rpc('has_role', { _user_id: session.user.id, _role: 'collaborator' }),
          supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' })
        ]);

        setHasCollaboratorAccess(collaboratorResult.data || adminResult.data || false);
      } catch (error) {
        console.error('Error checking access:', error);
        setHasCollaboratorAccess(false);
      }
    };

    checkAccess();
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const baseNavItems = session
    ? [
        { label: "Explore Map", onClick: () => navigate("/map") },
        { label: "Events", onClick: () => navigate("/events") },
        { label: "Opportunities", onClick: () => navigate("/opportunities") },
        { label: "Community", onClick: () => navigate("/community") },
        { label: "Blog", onClick: () => navigate("/blog") },
        { label: "Collaborate", onClick: () => navigate("/collaborate") },
        { label: "Dashboard", onClick: () => navigate("/dashboard") },
      ]
    : [
        { label: "Explore Map", onClick: () => navigate("/map") },
        { label: "Events", onClick: () => navigate("/events") },
        { label: "Opportunities", onClick: () => navigate("/opportunities") },
        { label: "Community", onClick: () => navigate("/community") },
        { label: "Blog", onClick: () => navigate("/blog") },
        { label: "Collaborate", onClick: () => navigate("/collaborate") },
        { label: "Pricing", onClick: () => navigate("/pricing") },
      ];

  // Add collaborator link if user has access
  const navItems = [
    ...baseNavItems,
    ...(hasCollaboratorAccess ? [{ label: "Collaborator", onClick: () => navigate("/collaborator"), icon: Palette }] : []),
    session
      ? { label: "Sign Out", onClick: handleSignOut }
      : { label: "Sign In", onClick: () => navigate("/auth") },
  ];

  return (
    <header className="border-b border-border bg-[#121212] sticky top-0 z-50">
      <div className="h-16 flex items-center justify-between w-full px-4 md:px-5">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate("/")}
        >
          <img 
            src={logoImage} 
            alt="Creative Atlas" 
            className="h-10 md:h-14 w-auto object-contain" 
          />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(item => (
            <Button 
              key={item.label} 
              variant="ghost" 
              onClick={item.onClick} 
              className={`text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors ${
                'icon' in item ? 'gap-1.5' : ''
              }`}
            >
              {'icon' in item && item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-[#121212] border-border">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map(item => (
                <Button 
                  key={item.label} 
                  variant="ghost" 
                  className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-2" 
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  {'icon' in item && item.icon && <item.icon className="h-5 w-5" />}
                  {item.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
