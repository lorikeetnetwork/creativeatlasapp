import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { BentoContentCard } from '@/components/ui/bento-page-layout';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { CollaboratorStats } from '@/components/collaborator/CollaboratorStats';
import { EventsTab } from '@/components/collaborator/EventsTab';
import { OpportunitiesTab } from '@/components/collaborator/OpportunitiesTab';
import { ArticlesTab } from '@/components/collaborator/ArticlesTab';
import { CommunityTab } from '@/components/collaborator/CommunityTab';
import { ShowcasesTab } from '@/components/collaborator/ShowcasesTab';
import { AdminOverviewTab } from '@/components/dashboard/AdminOverviewTab';
import { PendingLocationsTable } from '@/components/admin/PendingLocationsTable';
import { BulkImport } from '@/components/admin/BulkImport';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManageDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Access Denied',
          description: 'You must be logged in to access this page.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      // Check for admin role
      const { data: adminData } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      // Check for collaborator role
      const { data: collaboratorData } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'collaborator' });

      if (!adminData && !collaboratorData) {
        toast({
          title: 'Access Denied',
          description: "You don't have permission to access the dashboard.",
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setIsAdmin(!!adminData);
      setHasAccess(true);
    } catch (error) {
      console.error('Error checking access:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify access.',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {isAdmin ? (
              <AdminOverviewTab />
            ) : (
              <>
                <CollaboratorStats />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <BentoContentCard title="Quick Actions" className="p-4">
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/events/new')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/opportunities/new')}>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Post Opportunity
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/blog/new')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Write Article
                      </Button>
                    </div>
                  </BentoContentCard>
                </div>
              </>
            )}
          </div>
        );
      case 'events':
        return (
          <BentoContentCard>
            <EventsTab />
          </BentoContentCard>
        );
      case 'opportunities':
        return (
          <BentoContentCard>
            <OpportunitiesTab />
          </BentoContentCard>
        );
      case 'articles':
        return (
          <BentoContentCard>
            <ArticlesTab />
          </BentoContentCard>
        );
      case 'community':
        return (
          <BentoContentCard>
            <CommunityTab />
          </BentoContentCard>
        );
      case 'showcases':
        return (
          <BentoContentCard>
            <ShowcasesTab />
          </BentoContentCard>
        );
      case 'pending':
        return (
          <BentoContentCard>
            <PendingLocationsTable status="Pending" />
          </BentoContentCard>
        );
      case 'all-locations':
        return (
          <BentoContentCard>
            <PendingLocationsTable status="all" />
          </BentoContentCard>
        );
      case 'bulk-import':
        return (
          <BentoContentCard>
            <BulkImport />
          </BentoContentCard>
        );
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      overview: 'Overview',
      events: 'Events',
      opportunities: 'Opportunities',
      articles: 'Blog Articles',
      community: 'Community',
      showcases: 'Showcases',
      pending: 'Pending Locations',
      'all-locations': 'All Locations',
      'bulk-import': 'Bulk Import',
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar 
          isAdmin={isAdmin} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b border-border px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">{getTabTitle()}</h1>
          </header>
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
