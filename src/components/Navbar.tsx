import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, Compass, Calendar, Briefcase, Users, BookOpen, CreditCard, LogOut, 
  LayoutDashboard, Map, Plus, Award, FileText, User 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/creative-atlas-logo.png";
import betaBadge from "@/assets/beta.png";
import type { Session } from "@supabase/supabase-js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavbarProps {
  session?: Session | null;
}

// ListItem component for dropdown content
const ListItem = ({
  className,
  title,
  children,
  href,
  icon: Icon,
  ...props
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none p-3 border-2 border-transparent leading-none no-underline outline-none transition-all hover:border-primary hover:bg-accent/20 hover:translate-x-[2px] hover:translate-y-[2px]",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-bold leading-none mb-1">
            {Icon && <Icon className="h-4 w-4" />}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const Navbar = ({ session: propSession }: NavbarProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(propSession ?? null);
  const [hasCollaboratorAccess, setHasCollaboratorAccess] = useState(false);

  useEffect(() => {
    if (propSession !== undefined) {
      setSession(propSession);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      return () => subscription.unsubscribe();
    }
  }, [propSession]);

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

  const getDashboardPath = () => hasCollaboratorAccess ? '/collaborator' : '/dashboard';

  const mobileNavItems = [
    { label: "Explore Map", icon: Map, onClick: () => navigate("/map") },
    { label: "Discover", icon: Compass, onClick: () => navigate("/discover") },
    { label: "Events", icon: Calendar, onClick: () => navigate("/events") },
    { label: "Opportunities", icon: Briefcase, onClick: () => navigate("/opportunities") },
    { label: "Community", icon: Users, onClick: () => navigate("/community") },
    { label: "Blog", icon: BookOpen, onClick: () => navigate("/blog") },
    { label: "Resources", icon: FileText, onClick: () => navigate("/resources") },
    { label: "Showcases", icon: Award, onClick: () => navigate("/showcases") },
  ];

  return (
    <header className="h-14 flex-shrink-0 border-b-2 border-border bg-background flex items-center justify-between w-full sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center h-full pl-5">
        <img 
          src={logoImage} 
          alt="Creative Atlas" 
          className="h-10 w-auto object-contain cursor-pointer" 
          onClick={() => navigate("/")}
        />
      </div>

      {/* Desktop Navigation Menu */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {/* Explore Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/map"
                      className="flex h-full w-full select-none flex-col justify-end border-2 border-border bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none transition-all hover:border-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_hsl(var(--primary))]"
                    >
                      <Map className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-bold">
                        Creative Map
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Discover creative spaces, studios, and venues near you on our interactive map.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/discover" title="Discover Artists" icon={Compass}>
                  Find creative professionals and collaborators in your area.
                </ListItem>
                <ListItem href="/events" title="Events" icon={Calendar}>
                  Browse upcoming exhibitions, workshops, and performances.
                </ListItem>
                <ListItem href="/community" title="Community" icon={Users}>
                  Connect with fellow creatives and join discussions.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Create Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Create</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/opportunities" title="Opportunities" icon={Briefcase}>
                  Post or find jobs, residencies, and collaborations.
                </ListItem>
                <ListItem href="/showcases" title="Showcases" icon={Award}>
                  Share your creative work and get featured.
                </ListItem>
                <li className="md:col-span-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/collaborate"
                      className="flex w-full select-none items-center gap-3 p-4 border-2 border-dashed border-secondary bg-secondary/10 leading-none no-underline outline-none transition-all hover:border-secondary hover:bg-secondary/20 hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      <Plus className="h-5 w-5" />
                      <div>
                        <div className="text-sm font-bold leading-none mb-1">Submit Entity</div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          Add your business, studio, or venue to the Creative Atlas.
                        </p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Learn Dropdown */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                <ListItem href="/blog" title="Blog" icon={BookOpen}>
                  Read articles from the creative community.
                </ListItem>
                <ListItem href="/resources" title="Resources" icon={FileText}>
                  Tools, guides, and templates for creatives.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Pricing Link */}
          <NavigationMenuItem>
            <Link to="/pricing">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pricing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right side: Controls */}
      <div className="pr-5 flex items-center gap-2">
        {/* Desktop Auth Buttons */}
        {session ? (
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost"
              onClick={() => navigate(getDashboardPath())}
              className="border-2 border-transparent hover:border-primary hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase text-sm"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="ghost"
              onClick={handleSignOut}
              className="border-2 border-transparent hover:border-destructive hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <img src={betaBadge} alt="Beta" className="h-6 w-auto" />
            <Button 
              variant="default"
              onClick={() => navigate("/auth")}
              className="border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold uppercase text-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        )}

        {/* Mobile Nav Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-transparent hover:border-primary">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-background border-l-2 border-border">
            <div className="flex flex-col gap-4 mt-8">
              {mobileNavItems.map(item => (
                <Button 
                  key={item.label} 
                  variant="ghost" 
                  className="justify-start text-lg h-12 border-2 border-transparent hover:border-primary hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase gap-3" 
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
              <div className="border-t-2 border-border my-2" />
              <Button 
                variant="ghost" 
                className="justify-start text-lg h-12 border-2 border-transparent hover:border-primary hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase gap-3" 
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
                className="justify-start text-lg h-12 border-2 border-dashed border-secondary hover:bg-secondary/20 hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase gap-3" 
                onClick={() => {
                  navigate("/collaborate");
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="h-5 w-5" />
                Submit Entity
              </Button>
              {session ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-lg h-12 border-2 border-transparent hover:border-primary hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase gap-3" 
                    onClick={() => {
                      navigate(getDashboardPath());
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-lg h-12 border-2 border-transparent hover:border-destructive hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold uppercase gap-3" 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <img src={betaBadge} alt="Beta" className="h-5 w-auto" />
                  <Button 
                    variant="default" 
                    className="flex-1 justify-start text-lg h-12 border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold uppercase gap-3" 
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5" />
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
