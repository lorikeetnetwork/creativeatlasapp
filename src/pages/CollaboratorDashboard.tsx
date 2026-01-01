import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { BentoContentCard } from '@/components/ui/bento-page-layout';
import { CollaboratorSidebar } from '@/components/dashboard/CollaboratorSidebar';
import { CollaboratorStats } from '@/components/collaborator/CollaboratorStats';
import { EventsTab } from '@/components/collaborator/EventsTab';
import { OpportunitiesTab } from '@/components/collaborator/OpportunitiesTab';
import { ArticlesTab } from '@/components/collaborator/ArticlesTab';
import { CommunityTab } from '@/components/collaborator/CommunityTab';
import { ShowcasesTab } from '@/components/collaborator/ShowcasesTab';
import { ApplicationsTab } from '@/components/collaborator/ApplicationsTab';
import { PendingLocationsTable } from '@/components/admin/PendingLocationsTable';
import { BulkImport } from '@/components/admin/BulkImport';
import { UserManagementTab } from '@/components/dashboard/UserManagementTab';
import { AdminStats } from '@/components/admin/AdminStats';
import { AccountTab } from '@/components/dashboard/AccountTab';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, Briefcase, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function CollaboratorDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [fetchingOgImages, setFetchingOgImages] = useState(false);
  const [ogProgress, setOgProgress] = useState({ current: 0, total: 0 });

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

      // Check for collaborator role
      const { data: collaboratorData } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'collaborator' });

      // Check for admin role (also has access)
      const { data: adminData } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (!collaboratorData && !adminData) {
        toast({
          title: 'Access Denied',
          description: "You don't have permission to access the collaborator dashboard.",
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

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

  const handleFetchOgImages = async () => {
    setFetchingOgImages(true);
    try {
      const { data: locations, error } = await supabase
        .from('locations')
        .select('id, website')
        .not('website', 'is', null)
        .is('og_image_url', null);

      if (error) throw error;

      if (!locations || locations.length === 0) {
        toast({
          title: 'No websites to process',
          description: 'All locations with websites already have OG images.',
        });
        setFetchingOgImages(false);
        return;
      }

      setOgProgress({ current: 0, total: locations.length });

      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        setOgProgress({ current: i + 1, total: locations.length });

        try {
          const { data: ogData, error: fetchError } = await supabase.functions.invoke('fetch-og-image', {
            body: { url: location.website }
          });

          if (fetchError) {
            console.error(`Error fetching OG for ${location.id}:`, fetchError);
            continue;
          }

          if (ogData?.ogImage) {
            await supabase
              .from('locations')
              .update({ 
                og_image_url: ogData.ogImage,
                og_description: ogData.ogDescription 
              })
              .eq('id', location.id);
          }
        } catch (err) {
          console.error(`Error processing location ${location.id}:`, err);
        }
      }

      toast({
        title: 'OG Images fetched',
        description: `Processed ${locations.length} locations.`,
      });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFetchingOgImages(false);
      setOgProgress({ current: 0, total: 0 });
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
      case 'account':
        return <AccountTab />;
      case 'overview':
        return (
          <div className="space-y-6">
            <AdminStats />
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

              <BentoContentCard title="Fetch OG Images" className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Fetch Open Graph images for locations that have websites but no OG image.
                </p>
                <Button
                  variant="outline"
                  onClick={handleFetchOgImages}
                  disabled={fetchingOgImages}
                  className="w-full justify-start"
                >
                  <Image className="h-4 w-4 mr-2" />
                  {fetchingOgImages 
                    ? `Processing ${ogProgress.current}/${ogProgress.total}...`
                    : 'Fetch OG Images'
                  }
                </Button>
              </BentoContentCard>
            </div>
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
      case 'applications':
        return (
          <BentoContentCard title="Collaborator Applications">
            <ApplicationsTab />
          </BentoContentCard>
        );
      case 'users':
        return (
          <BentoContentCard title="User Management">
            <UserManagementTab />
          </BentoContentCard>
        );
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      account: 'My Account',
      overview: 'Overview',
      events: 'Events',
      opportunities: 'Opportunities',
      articles: 'Blog Articles',
      community: 'Community',
      showcases: 'Showcases',
      pending: 'Pending Locations',
      'all-locations': 'All Locations',
      'bulk-import': 'Bulk Import',
      applications: 'Collaborator Applications',
      users: 'User Management',
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CollaboratorSidebar 
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
