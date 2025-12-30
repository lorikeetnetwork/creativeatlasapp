import { useNavigate } from 'react-router-dom';
import { useCollaboratorRole } from '@/hooks/useCollaboratorRole';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  FileText,
  Users,
  Award,
  MapPin,
  Upload,
  Clock,
  ArrowLeft,
  Shield,
  UserCog,
  Crown,
} from 'lucide-react';

interface CollaboratorSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CollaboratorSidebar({ activeTab, onTabChange }: CollaboratorSidebarProps) {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { isMaster } = useCollaboratorRole();
  const isCollapsed = state === 'collapsed';

  const contentItems = [
    { id: 'overview', title: 'Overview', icon: LayoutDashboard },
    { id: 'events', title: 'Events', icon: Calendar },
    { id: 'opportunities', title: 'Opportunities', icon: Briefcase },
    { id: 'articles', title: 'Blog', icon: FileText },
    { id: 'resources', title: 'Resources', icon: Upload },
    { id: 'community', title: 'Community', icon: Users },
    { id: 'showcases', title: 'Showcases', icon: Award },
  ];

  const locationItems = [
    { id: 'pending', title: 'Pending Locations', icon: Clock },
    { id: 'all-locations', title: 'All Locations', icon: MapPin },
    { id: 'bulk-import', title: 'Bulk Import', icon: Upload },
  ];

  // Master-only admin items
  const adminItems = [
    { id: 'applications', title: 'Applications', icon: Shield },
    { id: 'users', title: 'User Management', icon: UserCog },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          {isMaster ? (
            <Crown className="h-6 w-6 text-amber-500 shrink-0" />
          ) : (
            <Shield className="h-6 w-6 text-primary shrink-0" />
          )}
          {!isCollapsed && (
            <span className="font-semibold text-lg">
              {isMaster ? 'Master' : 'Collaborator'}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Locations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {locationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Only show Admin section to master account */}
        {isMaster && (
          <SidebarGroup>
            <SidebarGroupLabel>Master Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => onTabChange(item.id)}
                      tooltip={item.title}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate('/map')} tooltip="Back to Map">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Map</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
