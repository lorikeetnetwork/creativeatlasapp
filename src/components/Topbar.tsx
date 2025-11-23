import { LogOut, User, Menu, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session } from "@supabase/supabase-js";
import logoImage from "@/assets/creative-atlas-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  session: Session | null;
  onSignOut: () => void;
  onSignIn: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const Topbar = ({
  session,
  onSignOut,
  onSignIn,
  isSidebarCollapsed,
  onToggleSidebar,
}: TopbarProps) => {
  return (
    <header className="h-14 flex-shrink-0 border-b bg-card flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        <img 
          src={logoImage} 
          alt="Creative Atlas" 
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {session ? (
            <>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                My Listings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={onSignIn}>
              Sign In
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Topbar;
