import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Compass, Calendar, Briefcase, Users, BookOpen, CreditCard, LogOut, LayoutDashboard, Handshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/creative-atlas-logo.png";
import type { Session } from "@supabase/supabase-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface NavbarProps {
  session?: Session | null;
}
const Navbar = ({
  session: propSession
}: NavbarProps) => {
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
      supabase.auth.getSession().then(({
        data: {
          session
        }
      }) => {
        setSession(session);
      });
      const {
        data: {
          subscription
        }
      } = supabase.auth.onAuthStateChange((_event, session) => {
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
        const [collaboratorResult, adminResult] = await Promise.all([supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'collaborator'
        }), supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        })]);
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

  // Get dashboard destination based on role
  const getDashboardPath = () => hasCollaboratorAccess ? '/collaborator' : '/dashboard';

  // Main nav items (always visible)
  const navItems = [{
    label: "Explore Map",
    icon: Compass,
    onClick: () => navigate("/map")
  }, {
    label: "Discover",
    icon: Compass,
    onClick: () => navigate("/discover")
  }, {
    label: "Events",
    icon: Calendar,
    onClick: () => navigate("/events")
  }, {
    label: "Opportunities",
    icon: Briefcase,
    onClick: () => navigate("/opportunities")
  }, {
    label: "Community",
    icon: Users,
    onClick: () => navigate("/community")
  }, {
    label: "Blog",
    icon: BookOpen,
    onClick: () => navigate("/blog")
  }, {
    label: "Collaborate",
    icon: Handshake,
    onClick: () => navigate("/collaborate")
  }];
  return <header className="border-b border-border bg-[#121212] sticky top-0 z-50">
      <div className="h-16 flex items-center justify-between w-full px-4 md:px-5 bg-stone-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src={logoImage} alt="Creative Atlas" className="h-10 md:h-14 w-auto object-contain" />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => <Button key={item.label} variant="ghost" onClick={item.onClick} className="text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>)}
          
          {/* Pricing button */}
          <Button variant="ghost" onClick={() => navigate("/pricing")} className="text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-2">
            <CreditCard className="h-4 w-4" />
            Pricing
          </Button>

          {/* Desktop Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md text-white hover:bg-transparent border border-transparent hover:border-orange-500 transition-colors">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session ? <>
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </> : <DropdownMenuItem onClick={() => navigate('/auth')}>
                  Sign In
                </DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
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
              {navItems.map(item => <Button key={item.label} variant="ghost" className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" onClick={() => {
              item.onClick();
              setMobileMenuOpen(false);
            }}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>)}
              <div className="border-t border-border my-2" />
              <Button variant="ghost" className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" onClick={() => {
              navigate("/pricing");
              setMobileMenuOpen(false);
            }}>
                <CreditCard className="h-5 w-5" />
                Pricing
              </Button>
              {session ? <>
                  <Button variant="ghost" className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" onClick={() => {
                navigate(getDashboardPath());
                setMobileMenuOpen(false);
              }}>
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}>
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </> : <Button variant="ghost" className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" onClick={() => {
              navigate("/auth");
              setMobileMenuOpen(false);
            }}>
                  Sign In
                </Button>}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>;
};
export default Navbar;