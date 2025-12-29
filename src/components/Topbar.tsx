import { LogOut, User, Menu, Shield, Plus, Calendar, Briefcase, Users, BookOpen, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import logoImage from "@/assets/creative-atlas-logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface TopbarProps {
  session: Session | null;
  onSignOut: () => void;
  onSignIn: () => void;
  onOpenForm: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  rightAddon?: ReactNode;
  className?: string;
}

const Topbar = ({
  session,
  onSignOut,
  onSignIn,
  onOpenForm,
  isSidebarCollapsed,
  onToggleSidebar,
  rightAddon,
  className
}: TopbarProps) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [session]);

  const checkAdminStatus = async () => {
    if (!session?.user) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      });
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const navItems = [
    { label: "Events", icon: Calendar, onClick: () => navigate("/events") },
    { label: "Opportunities", icon: Briefcase, onClick: () => navigate("/opportunities") },
    { label: "Community", icon: Users, onClick: () => navigate("/community") },
    { label: "Blog", icon: BookOpen, onClick: () => navigate("/blog") },
  ];

  return (
    <header className={`h-14 flex-shrink-0 border-b-2 border-black bg-background flex items-center justify-between w-full p-0 m-0 ${className || ''}`}>
      <div className="flex items-center h-full pl-5">
        <img 
          src={logoImage} 
          alt="Creative Atlas" 
          className="h-10 w-auto ml-3 object-fill cursor-pointer" 
          onClick={() => navigate("/")}
        />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map(item => (
          <Button 
            key={item.label} 
            variant="ghost" 
            onClick={item.onClick} 
            className="text-foreground hover:bg-transparent hover:text-foreground border border-transparent hover:border-orange-500 transition-colors gap-2"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Right side: Map controls + Pricing + Sign In + Menu */}
      <div className="pr-5 flex items-center gap-2">
        {rightAddon}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/pricing")} 
          className="hidden md:flex text-foreground hover:bg-transparent hover:text-foreground border border-transparent hover:border-orange-500 transition-colors gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Pricing
        </Button>
        {!session && (
          <Button 
            variant="ghost" 
            onClick={onSignIn} 
            className="hidden md:flex text-foreground hover:bg-transparent hover:text-foreground border border-transparent hover:border-orange-500 transition-colors gap-2"
          >
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
        {/* Mobile Nav Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-[#121212] border-border">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map(item => (
                <Button 
                  key={item.label} 
                  variant="ghost" 
                  className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" 
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
              <div className="border-t border-border my-2" />
              <Button 
                variant="ghost" 
                className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" 
                onClick={() => {
                  navigate("/pricing");
                  setMobileMenuOpen(false);
                }}
              >
                <CreditCard className="h-5 w-5" />
                Pricing
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" 
                onClick={() => {
                  onOpenForm();
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="h-5 w-5" />
                Submit Entity
              </Button>
              {session ? (
                <>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" 
                      onClick={() => {
                        navigate('/admin');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Shield className="h-5 w-5" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" 
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" 
                    onClick={() => {
                      onSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  className="justify-start text-lg h-12 text-white hover:bg-transparent hover:text-white border border-transparent hover:border-orange-500 transition-colors gap-3" 
                  onClick={() => {
                    onSignIn();
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden md:flex">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md text-foreground hover:bg-transparent border border-transparent hover:border-orange-500 transition-colors">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpenForm}>
              <Plus className="w-4 h-4 mr-2" />
              Submit Entity
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {session ? (
              <>
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/pricing')}>
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => navigate('/pricing')}>
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignIn}>
                  Sign In
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;