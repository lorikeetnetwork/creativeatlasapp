import { LogOut, User, Menu, ChevronRight, ChevronLeft, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import logoImage from "@/assets/creative-atlas-logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface TopbarProps {
  session: Session | null;
  onSignOut: () => void;
  onSignIn: () => void;
  onOpenForm: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  className?: string;
}
const Topbar = ({
  session,
  onSignOut,
  onSignIn,
  onOpenForm,
  isSidebarCollapsed,
  onToggleSidebar,
  className
}: TopbarProps) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    checkAdminStatus();
  }, [session]);
  const checkAdminStatus = async () => {
    if (!session?.user) {
      setIsAdmin(false);
      return;
    }
    try {
      const {
        data,
        error
      } = await supabase.rpc('has_role', {
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
  return <header className={`h-14 flex-shrink-0 border-b-2 border-black bg-background flex items-center justify-between w-full p-0 m-0 ${className || ''}`}>
      <div className="flex items-center h-full pl-5">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-full w-14 rounded-none p-0 m-0 bg-primary-glow">
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        
        <img src={logoImage} alt="Creative Atlas" className="h-8 w-auto object-contain ml-3" />
      </div>

      {/* User Menu */}
      <div className="pr-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md bg-muted hover:bg-muted/80">
              <Menu className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onOpenForm}>
            <Plus className="w-4 h-4 mr-2" />
            Submit Entity
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {session ? <>
              {isAdmin && <>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>}
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
            </> : <>
              <DropdownMenuItem onClick={() => navigate('/pricing')}>
                Pricing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignIn}>
                Sign In
              </DropdownMenuItem>
            </>}
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
};
export default Topbar;